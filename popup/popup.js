// DOM元素
const newMemoInput = document.getElementById('newMemo');
const addMemoButton = document.getElementById('addMemo');
const searchInput = document.getElementById('searchInput');
const memoList = document.getElementById('memoList');
const editModal = document.getElementById('editModal');
const editMemoText = document.getElementById('editMemoText');
const saveEditButton = document.getElementById('saveEdit');
const cancelEditButton = document.getElementById('cancelEdit');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const clearDateFilterBtn = document.getElementById('clearDateFilter');
const emptyState = document.getElementById('emptyState');
const previewContent = document.getElementById('previewContent');
const editPreviewContent = document.getElementById('editPreviewContent');

let currentEditingMemoId = null;

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('初始化开始');
    try {
        // 初始化存储
        await new Promise((resolve, reject) => {
            chrome.storage.local.get(['memos'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else if (!result.memos) {
                    chrome.storage.local.set({ memos: [] }, () => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });
        });

        // 刷新列表
        await refreshMemoList();
        
        // 添加实时预览监听器
        newMemoInput.addEventListener('input', () => updatePreview(newMemoInput, previewContent));
        editMemoText.addEventListener('input', () => updatePreview(editMemoText, editPreviewContent));
        
        console.log('初始化完成');
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 更新预览内容
function updatePreview(input, previewElement) {
    const content = input.value.trim();
    if (content) {
        try {
            const htmlContent = MarkdownParser.parse(content);
            previewElement.innerHTML = htmlContent;
        } catch (error) {
            console.error('Markdown解析错误:', error);
            previewElement.innerHTML = '<p class="error">预览出错</p>';
        }
    } else {
        previewElement.innerHTML = '<p class="empty-preview">预览区域</p>';
    }
}

// 添加备忘录
addMemoButton.addEventListener('click', async () => {
    const content = newMemoInput.value.trim();
    if (!content) {
        showNotification('请输入备忘录内容');
        return;
    }

    try {
        console.log('开始添加备忘录');
        await MemoStorage.addMemo(content);
        console.log('备忘录添加成功');
        newMemoInput.value = '';
        previewContent.innerHTML = '<p class="empty-preview">预览区域</p>';
        await refreshMemoList();
        showNotification('备忘录添加成功');
    } catch (error) {
        console.error('添加备忘录失败:', error);
        showNotification('添加备忘录失败');
    }
});

// 搜索备忘录
let searchTimeout;
searchInput.addEventListener('input', async () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const keyword = searchInput.value.trim();
        try {
            const memos = await MemoStorage.searchMemos(keyword);
            renderMemoList(memos);
        } catch (error) {
            console.error('搜索失败:', error);
            showNotification('搜索失败');
        }
    }, 300);
});

// 刷新备忘录列表
async function refreshMemoList() {
    try {
        const searchKeyword = searchInput.value.trim().toLowerCase();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        // 先按时间范围筛选
        let memos = await MemoStorage.filterMemosByDateRange(startDate, endDate);
        
        // 再按关键词筛选
        if (searchKeyword) {
            memos = memos.filter(memo => 
                memo.content.toLowerCase().includes(searchKeyword)
            );
        }

        // 清空当前列表
        memoList.innerHTML = '';
        
        // 显示或隐藏空状态提示
        if (memos.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';

        // 按时间倒序排序
        memos.sort((a, b) => b.timestamp - a.timestamp);

        // 渲染备忘录列表
        memos.forEach(memo => {
            const memoElement = createMemoElement(memo);
            memoList.appendChild(memoElement);
        });
    } catch (error) {
        console.error('刷新备忘录列表时出错:', error);
        showNotification('刷新列表失败，请重试', 'error');
    }
}

// 渲染备忘录列表
function renderMemoList(memos) {
    memoList.innerHTML = '';
    
    if (!memos || memos.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    memos.forEach(memo => {
        const memoElement = createMemoElement(memo);
        memoList.appendChild(memoElement);
    });
}

// 创建备忘录元素
function createMemoElement(memo) {
    const div = document.createElement('div');
    div.className = 'memo-item';
    
    const content = document.createElement('div');
    content.className = 'memo-content markdown-preview';
    try {
        content.innerHTML = MarkdownParser.parse(memo.content);
    } catch (error) {
        console.error('Markdown解析错误:', error);
        content.textContent = memo.content;
    }
    
    const actions = document.createElement('div');
    actions.className = 'memo-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.innerHTML = '<span class="icon">✏️</span> 编辑';
    editButton.onclick = () => openEditModal(memo);
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = '<span class="icon">🗑️</span> 删除';
    deleteButton.onclick = async () => {
        if (confirm('确定要删除这条备忘录吗？')) {
            try {
                await MemoStorage.deleteMemo(memo.id);
                await refreshMemoList();
                showNotification('删除成功');
            } catch (error) {
                console.error('删除失败:', error);
                showNotification('删除失败');
            }
        }
    };
    
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    div.appendChild(content);
    div.appendChild(actions);
    
    const timeInfo = document.createElement('div');
    timeInfo.className = 'memo-time';
    const createDate = new Date(memo.createdAt);
    timeInfo.innerHTML = `<span class="icon">🕒</span> ${createDate.toLocaleString()}`;
    div.appendChild(timeInfo);
    
    return div;
}

// 打开编辑模态框
function openEditModal(memo) {
    currentEditingMemoId = memo.id;
    editMemoText.value = memo.content;
    updatePreview(editMemoText, editPreviewContent);
    editModal.style.display = 'block';
    editMemoText.focus();
}

// 关闭编辑模态框
function closeEditModal() {
    currentEditingMemoId = null;
    editMemoText.value = '';
    editPreviewContent.innerHTML = '<p class="empty-preview">预览区域</p>';
    editModal.style.display = 'none';
}

// 保存编辑
saveEditButton.addEventListener('click', async () => {
    const newContent = editMemoText.value.trim();
    if (!newContent) {
        showNotification('请输入备忘录内容');
        return;
    }

    try {
        await MemoStorage.updateMemo(currentEditingMemoId, newContent);
        closeEditModal();
        await refreshMemoList();
        showNotification('更新成功');
    } catch (error) {
        console.error('更新失败:', error);
        showNotification('更新失败');
    }
});

// 取消编辑
cancelEditButton.addEventListener('click', closeEditModal);

// 显示通知
function showNotification(message) {
    chrome.runtime.sendMessage({
        type: 'notification',
        message: message
    });
}

// 按下回车键添加备忘录
newMemoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addMemoButton.click();
    }
});

// 点击模态框外部关闭
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// 添加时间筛选相关的事件监听器
startDateInput.addEventListener('change', refreshMemoList);
endDateInput.addEventListener('change', refreshMemoList);

// 清除时间筛选
clearDateFilterBtn.addEventListener('click', () => {
    startDateInput.value = '';
    endDateInput.value = '';
    refreshMemoList();
}); 