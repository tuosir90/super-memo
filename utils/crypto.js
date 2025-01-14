// AES加密工具类
class CryptoUtil {
    static async generateKey() {
        // 生成随机密钥
        const key = await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
        return key;
    }

    static async getKey() {
        // 从storage获取密钥，如果不存在则生成新的
        return new Promise(async (resolve) => {
            chrome.storage.local.get(['encryptionKey'], async (result) => {
                if (result.encryptionKey) {
                    const key = await crypto.subtle.importKey(
                        "jwk",
                        JSON.parse(result.encryptionKey),
                        { name: "AES-GCM", length: 256 },
                        true,
                        ["encrypt", "decrypt"]
                    );
                    resolve(key);
                } else {
                    const newKey = await this.generateKey();
                    const exportedKey = await crypto.subtle.exportKey("jwk", newKey);
                    chrome.storage.local.set({ encryptionKey: JSON.stringify(exportedKey) });
                    resolve(newKey);
                }
            });
        });
    }

    static async encrypt(text) {
        try {
            const key = await this.getKey();
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encodedText = new TextEncoder().encode(text);

            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                encodedText
            );

            const encryptedArray = new Uint8Array(encryptedData);
            const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
            combinedArray.set(iv);
            combinedArray.set(encryptedArray, iv.length);

            return btoa(String.fromCharCode(...combinedArray));
        } catch (error) {
            console.error('加密失败:', error);
            throw error;
        }
    }

    static async decrypt(encryptedData) {
        try {
            const key = await this.getKey();
            const combinedArray = new Uint8Array(
                atob(encryptedData).split('').map(char => char.charCodeAt(0))
            );

            const iv = combinedArray.slice(0, 12);
            const encryptedArray = combinedArray.slice(12);

            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                encryptedArray
            );

            return new TextDecoder().decode(decryptedData);
        } catch (error) {
            console.error('解密失败:', error);
            throw error;
        }
    }
} 