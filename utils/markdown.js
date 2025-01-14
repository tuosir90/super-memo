// 简单的Markdown解析器
class MarkdownParser {
    static parse(text) {
        if (!text) return '';
        
        let html = text;

        // 转义HTML特殊字符
        html = html.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;');

        // 代码块
        html = html.replace(/```([\s\S]*?)```/g, function(match, code) {
            return '<pre><code>' + code.trim() + '</code></pre>';
        });
        
        // 行内代码
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 标题 (h1 - h6)
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
                   .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                   .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                   .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
                   .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
                   .replace(/^###### (.*$)/gm, '<h6>$1</h6>');

        // 粗体
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 斜体
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 删除线
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

        // 引用
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

        // 无序列表
        html = html.replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*?<\/li>\s*)+/gs, function(match) {
            return '<ul>' + match + '</ul>';
        });

        // 有序列表
        html = html.replace(/^\d+\.\s+(.*)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*?<\/li>\s*)+/gs, function(match) {
            return '<ol>' + match + '</ol>';
        });

        // 链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // 图片
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" title="$1">');

        // 水平线
        html = html.replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '<hr>');

        // 处理段落
        html = html.replace(/\n\s*\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // 清理空段落
        html = html.replace(/<p>\s*<\/p>/g, '');

        // 修复列表和引用中的段落
        html = html.replace(/<\/ul>\s*<p>/g, '</ul>')
                   .replace(/<\/ol>\s*<p>/g, '</ol>')
                   .replace(/<\/blockquote>\s*<p>/g, '</blockquote>');

        // 处理换行
        html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

        return html;
    }

    // 清理HTML标签（用于搜索等场景）
    static stripHtml(html) {
        return html.replace(/<[^>]*>/g, '');
    }

    // 获取纯文本内容
    static getPlainText(markdown) {
        return this.stripHtml(this.parse(markdown));
    }
} 