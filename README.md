# 📝 超级备忘录 Chrome扩展

> 一个简单而强大的Chrome浏览器扩展，让你的灵感和待办事项不再错过！

## 🌟 主要特性

### 1. 便捷记录
- 🚀 一键开启，快速记录
- 📝 支持Markdown格式，让笔记更优雅
- 👀 实时预览，所见即所得
- 🎨 简约现代的界面设计

### 2. 智能管理
- 🔍 支持关键词快速检索
- 📅 支持日期范围筛选
- ⏰ 时间轴显示，记录创建时间
- 📋 支持编辑和删除操作

### 3. 安全可靠
- 🔐 采用AES-256加密技术
- 💾 数据本地存储，无需担心隐私泄露
- 🚫 无需注册账号，开箱即用
- ⚡ 响应迅速，性能优异

### 4. 人性化设计
- 🌓 优雅的界面动画
- 📱 响应式设计，完美适配
- 🎯 简单直观的操作方式
- 🔔 操作结果即时通知

## 💡 使用场景

- 📚 学习笔记：快速记录课堂重点
- 💼 工作待办：高效管理任务清单
- 💭 灵感收集：随时捕捉创意火花
- 🔖 网页摘录：保存重要网页内容

## 🚀 快速开始

1. 下载项目代码
```bash
git clone https://github.com/tuosir90/super-memo.git
```

2. 在Chrome浏览器中加载扩展
- 打开Chrome浏览器，进入扩展管理页面（chrome://extensions/）
- 开启右上角的"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择项目目录即可

3. 开始使用
- 点击浏览器工具栏中的备忘录图标
- 在输入框中输入备忘内容（支持Markdown格式）
- 点击"添加备忘录"按钮保存
- 使用搜索框或日期筛选查找备忘录
- 可以随时编辑或删除已保存的备忘录

## 🛠️ 技术特点

1. **前端技术**
   - 原生JavaScript ES6+
   - HTML5 + CSS3
   - Markdown解析支持
   - Font Awesome图标

2. **存储加密**
   - Chrome Storage API
   - AES-256-GCM加密算法
   - 本地数据存储

3. **扩展功能**
   - Chrome Extension Manifest V3
   - Background Service Worker
   - Chrome Notifications API

## 📋 项目结构

```
super-memo/
├── manifest.json          // 扩展配置文件
├── popup/                 // 弹出窗口相关文件
│   ├── popup.html        // 弹出窗口HTML
│   ├── popup.css         // 弹出窗口样式
│   └── popup.js          // 弹出窗口逻辑
├── background/           // 后台服务
│   └── service-worker.js // 服务工作进程
├── utils/                // 工具类
│   ├── crypto.js        // 加密工具
│   ├── storage.js       // 存储管理
│   └── markdown.js      // Markdown解析
└── assets/              // 静态资源
    ├── icons/           // 扩展图标
    └── fontawesome/     // 字体图标
```

## 🤝 贡献代码

欢迎提交Issue和Pull Request！

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 提供漂亮的图标
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) - 提供扩展开发能力

---

**开发者**: tuosir90  
**版本**: 1.0.0  
**最后更新**: 2024-01-13

如果觉得这个扩展有帮助，欢迎给个Star ⭐️

最后更新时间：2024-01-13 15:30 