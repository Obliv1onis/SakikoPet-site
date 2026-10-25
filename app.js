'use strict';
const toast=document.querySelector('.toast'),toastText=document.querySelector('#toast-text');let toastTimer;
function notify(message){clearTimeout(toastTimer);toastText.textContent=message;toast.hidden=false;toast.classList.remove('pop-in');void toast.offsetWidth;toast.classList.add('pop-in');toastTimer=setTimeout(()=>{toast.hidden=true;},5000);}
document.querySelector('#toast-close').addEventListener('click',()=>{clearTimeout(toastTimer);toast.hidden=true;});
for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{const value=button.dataset.copy;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);}else{const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();button.focus();if(!copied)throw new Error('clipboard unavailable');}notify('提取码 '+value+' 已复制');}catch{notify('暂时无法自动复制，请手动复制提取码：'+value);}});

// Answers remain readable without JavaScript; these controls only narrow them.
const faqSearch=document.querySelector('#faq-search');
if(faqSearch){
 const items=[...document.querySelectorAll('.faq-item')],groups=[...document.querySelectorAll('.faq-group')];
 const count=document.querySelector('#faq-count'),empty=document.querySelector('#faq-empty');
 const categoryButtons=[...document.querySelectorAll('[data-faq-category]')],platformButtons=[...document.querySelectorAll('[data-faq-platform]')];
 let category='all',platform='all';
 const normalize=text=>text.normalize('NFKC').toLocaleLowerCase('zh-CN');
 const texts=new Map(items.map(item=>[item,normalize(item.textContent)]));
 function filterFaq(){
  const terms=normalize(faqSearch.value).trim().split(/\s+/).filter(Boolean);let visible=0;
  for(const item of items){
   const matches=(category==='all'||item.dataset.category===category)&&(platform==='all'||item.dataset.platform==='all'||item.dataset.platform===platform)&&terms.every(term=>texts.get(item).includes(term));
   item.hidden=!matches;if(matches)visible++;
  }
  for(const group of groups)group.hidden=![...group.querySelectorAll('.faq-item')].some(item=>!item.hidden);
  count.textContent=visible===items.length?'共 '+items.length+' 个问题 · 点击问题展开答案':'找到 '+visible+' 个问题';empty.hidden=visible!==0;
  for(const button of categoryButtons)button.setAttribute('aria-pressed',String(button.dataset.faqCategory===category));
  for(const button of platformButtons)button.setAttribute('aria-pressed',String(button.dataset.faqPlatform===platform));
 }
 function resetFaq(){category='all';platform='all';faqSearch.value='';filterFaq();}
 function openFaqHash(){
  const item=items.find(item=>'#'+item.id===location.hash);if(!item)return;
  resetFaq();item.open=true;requestAnimationFrame(()=>item.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
 }
 faqSearch.addEventListener('input',filterFaq);
 for(const button of categoryButtons)button.addEventListener('click',()=>{category=button.dataset.faqCategory;filterFaq();});
 for(const button of platformButtons)button.addEventListener('click',()=>{platform=button.dataset.faqPlatform;filterFaq();});
 document.querySelector('#faq-reset').addEventListener('click',()=>{resetFaq();faqSearch.focus();});
 for(const link of document.querySelectorAll('a[href^="#faq-"]'))link.addEventListener('click',()=>{if(link.hash===location.hash)openFaqHash();});
 window.addEventListener('hashchange',openFaqHash);filterFaq();openFaqHash();
}
