# SakikoPet 中心页

静态介绍与下载网站，沿用软件的奶白与灰紫配色。无需安装依赖或构建，`index.html` 可直接由 GitHub Pages 托管。

## 维护

- 下载地址和提取码：修改 `index.html` 中的下载区，更新时同时检查标注的平台。
- 版本视频：`videos.json` 保存 B 站公开元数据；页面使用静态视频卡片，更新时同步修改 HTML、JSON 和封面资源。
- 风格：`style.css`；复制提取码与提示交互：`app.js`。
- `assets/` 仅包含用于展示的桌宠素材与公开版本视频封面，不包含游戏存档、可执行文件或私有开发者工具。

本地预览：`python3 -m http.server 4173 --directory website`（在软件工作区根目录运行）。

网站发布到独立公开仓库 `Obliv1onis/SakikoPet-site` 的 GitHub Pages，软件源仓库保持原有可见性。更新网页不需要重新构建桌宠。
