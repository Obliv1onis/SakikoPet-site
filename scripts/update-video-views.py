#!/usr/bin/env python3
"""Refresh public Bilibili counts while retaining the last successful snapshot."""
from pathlib import Path
import datetime
import html
import json
import re
import time
import subprocess

ROOT = Path(__file__).resolve().parents[1]
cache = ROOT / 'video-views.json'
snapshot = json.loads(cache.read_text()) if cache.exists() else {'videos': {}}
now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
successes = 0
for video in json.loads((ROOT / 'videos.json').read_text()):
    bvid = video['bvid']
    for attempt in range(2):
        try:
            response = subprocess.run(
                ['curl', '--fail', '--silent', '--show-error', '--max-time', '15',
                 'https://api.bilibili.com/x/web-interface/view?bvid=' + bvid],
                check=True, capture_output=True, text=True, timeout=20)
            result = json.loads(response.stdout)
            if result.get('code') != 0:
                raise ValueError('Bilibili returned ' + str(result.get('code')))
            data = result['data']
            views = data['stat']['view']
            if data.get('bvid') != bvid or type(views) is not int or views < 0:
                raise ValueError('Invalid view count')
            snapshot['videos'][bvid] = {'views': views, 'updatedAt': now}
            successes += 1
            break
        except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError) as error:
            if attempt == 1:
                print(f'{bvid}: keeping previous count ({error})')
            else:
                time.sleep(1)
    time.sleep(.3)
if not successes:
    raise SystemExit('No fresh video counts; existing snapshot and page were left intact.')

def compact(number):
    for scale, unit in [(100000000, '亿'), (10000, '万')]:
        if number >= scale:
            return f'{number / scale:.1f}'.rstrip('0').rstrip('.') + unit
    return str(number)

page = ROOT / 'index.html'
source = page.read_text()
for bvid, value in snapshot['videos'].items():
    if not re.fullmatch(r'BV[A-Za-z0-9]+', bvid):
        continue
    count = value['views']
    badge = (f'<span class="video-views" title="{count:,} 次播放" aria-label="{count:,} 次播放">'
             '<svg viewBox="0 0 20 16" aria-hidden="true"><rect x="1" y="1" width="18" height="14" rx="3"/>'
             '<path d="m8 5 5 3-5 3Z"/></svg>' + html.escape(compact(count)) + '</span>')
    pattern = r'(<a\b[^>]*href="https://www\.bilibili\.com/video/' + re.escape(bvid) + r'"[^>]*>)(.*?)(</a>)'
    def decorate(match):
        body = match[2]
        if '<div class="video-cover">' not in body:
            return match[0]
        body = re.sub(r'<span class="video-views"[^>]*>.*?</span>', '', body, flags=re.S)
        body = body.replace('<div class="video-cover">', '<div class="video-cover">' + badge, 1)
        return match[1] + body + match[3]
    source = re.sub(pattern, decorate, source, flags=re.S)
snapshot['updatedAt'] = now
cache.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n')
page.write_text(source)
print(f'Refreshed {successes} video counts.')
