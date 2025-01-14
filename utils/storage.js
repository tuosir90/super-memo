// 备忘录存储管理类
class MemoStorage {
    // 添加新备忘录
    static async addMemo(content) {
        try {
            const encryptedContent = await CryptoUtil.encrypt(content);
            const memo = {
                id: Date.now(),
                content: encryptedContent,
                createdAt: new Date().toISOString()
            };

            return new Promise((resolve, reject) => {
                chrome.storage.local.get(['memos'], async (result) => {
                    const memos = result.memos || [];
                    memos.unshift(memo);
                    chrome.storage.local.set({ memos }, () => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(memo);
                        }
                    });
                });
            });
        } catch (error) {
            console.error('添加备忘录失败:', error);
            throw error;
        }
    }

    // 获取所有备忘录
    static async getAllMemos() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['memos'], async (result) => {
                try {
                    const memos = result.memos || [];
                    const decryptedMemos = await Promise.all(
                        memos.map(async (memo) => ({
                            ...memo,
                            content: await CryptoUtil.decrypt(memo.content)
                        }))
                    );
                    resolve(decryptedMemos);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    // 删除备忘录
    static async deleteMemo(id) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['memos'], (result) => {
                const memos = result.memos || [];
                const updatedMemos = memos.filter(memo => memo.id !== id);
                chrome.storage.local.set({ memos: updatedMemos }, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    // 更新备忘录
    static async updateMemo(id, newContent) {
        try {
            const encryptedContent = await CryptoUtil.encrypt(newContent);
            return new Promise((resolve, reject) => {
                chrome.storage.local.get(['memos'], (result) => {
                    const memos = result.memos || [];
                    const updatedMemos = memos.map(memo => {
                        if (memo.id === id) {
                            return {
                                ...memo,
                                content: encryptedContent,
                                updatedAt: new Date().toISOString()
                            };
                        }
                        return memo;
                    });

                    chrome.storage.local.set({ memos: updatedMemos }, () => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve();
                        }
                    });
                });
            });
        } catch (error) {
            console.error('更新备忘录失败:', error);
            throw error;
        }
    }

    // 搜索备忘录
    static async searchMemos(keyword) {
        try {
            const allMemos = await this.getAllMemos();
            return allMemos.filter(memo => 
                memo.content.toLowerCase().includes(keyword.toLowerCase())
            );
        } catch (error) {
            console.error('搜索备忘录失败:', error);
            throw error;
        }
    }

    /**
     * 根据时间范围筛选备忘录
     * @param {string} startDate - 开始日期，格式：YYYY-MM-DD
     * @param {string} endDate - 结束日期，格式：YYYY-MM-DD
     * @returns {Promise<Array>} - 返回在时间范围内的备忘录数组
     */
    static async filterMemosByDateRange(startDate, endDate) {
        try {
            const memos = await this.getAllMemos();
            if (!startDate && !endDate) {
                return memos;
            }

            const start = startDate ? new Date(startDate + 'T00:00:00') : new Date(0);
            const end = endDate ? new Date(endDate + 'T23:59:59.999') : new Date();

            return memos.filter(memo => {
                const memoDate = new Date(memo.createdAt);
                return memoDate >= start && memoDate <= end;
            });
        } catch (error) {
            console.error('筛选备忘录时出错:', error);
            throw error;
        }
    }
} 