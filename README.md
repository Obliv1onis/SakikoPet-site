## 维护

- 下载地址和提取码：修改 `index.html` 中的下载区，更新时同时检查标注的平台。
- 版本视频：`videos.json` 保存 B 站公开元数据；页面使用静态视频卡片，更新时同步修改 HTML、JSON 和封面资源。
- FAQ：`index.html` 内按七类维护 70 条静态答案，`app.js` 提供关键词搜索、平台／分类筛选和问题直达链接；无 JavaScript 时仍可折叠阅读。新增答案要同时核对两端的功能开放边界，保持解锁阈值与实际玩法一致。本地三份 TXT 是 Windows 0.8 参考资料，不在页面提供下载链接，也不随本站发布。
- 风格：`style.css`；复制提取码与提示交互：`app.js`。
- `assets/` 仅包含用于展示的桌宠素材与公开版本视频封面，不包含游戏存档、可执行文件或私有开发者工具。

本地预览：`python3 -m http.server 4173 --directory website`（在软件工作区根目录运行）。

网站发布到独立公开仓库 `Obliv1onis/SakikoPet-site` 的 GitHub Pages，软件源仓库保持原有可见性。更新网页不需要重新构建桌宠。

大模型与语音分类区分 Mac Dev 已实现的 DeepSeek 配置／钥匙串保存／启动检测与尚未开放的聊天、prompt 和动态朗读；当前 Mac Dev 为 0.9.0，不把它描述为公开 0.9 发布或 Windows 已同步。API 常识与报错参考 DeepSeek 官方文档；不要复制固定价格或过时型号。页面不会收集密钥。
