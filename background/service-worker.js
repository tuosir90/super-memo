// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
    console.log('备忘录扩展已安装');
    // 初始化存储
    chrome.storage.local.get(['memos'], (result) => {
        if (!result.memos) {
            chrome.storage.local.set({ memos: [] });
        }
    });
});

// 监听消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'notification') {
        // 创建通知
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../assets/icons/icon128.png',
            title: '备忘录',
            message: request.message,
            priority: 1
        });
    }
    return true;
}); 