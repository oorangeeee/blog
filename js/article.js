document.addEventListener('scroll', () => {
    const docElement = document.documentElement;
    const scrollPercent = (docElement.scrollTop) / (docElement.scrollHeight - docElement.clientHeight);
    docElement.style.setProperty('--scroll-percent', scrollPercent);
});

// 添加文章统计功能
function countArticleStats(section) {
    // 克隆节点避免影响原始DOM
    const clone = section.cloneNode(true);

    // 移除代码块
    clone.querySelectorAll('pre').forEach(pre => pre.remove());

    // 获取纯文本内容并统计
    const text = clone.textContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = text.length;

    // 统计代码部分
    const codeBlocks = section.querySelectorAll('pre code');
    let codeLines = 0;
    codeBlocks.forEach(block => {
        codeLines += block.textContent.split('\n').length;
    });

    return {
        wordCount,
        codeBlocks: codeBlocks.length,
        codeLines
    };
}

// 添加全局统计功能
function addGlobalStats() {
    let totalWords = 0;
    let totalCodeBlocks = 0;
    let totalCodeLines = 0;

    document.querySelectorAll('section').forEach(section => {
        const stats = countArticleStats(section);
        totalWords += stats.wordCount;
        totalCodeBlocks += stats.codeBlocks;
        totalCodeLines += stats.codeLines;
    });

    const globalStats = document.createElement('div');
    globalStats.className = 'global-stats';
    globalStats.innerHTML = `
        <div class="stats-header">
            <h3>📊 文章总览</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🖋️</div>
                    <div class="stat-value">${totalWords.toLocaleString()}字</div>
                    <div class="stat-label">正文内容</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-value">${totalCodeBlocks}个</div>
                    <div class="stat-label">代码示例</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📜</div>
                    <div class="stat-value">${totalCodeLines}行</div>
                    <div class="stat-label">代码总量</div>
                </div>
            </div>
        </div>
    `;

    // 插入到目录之前
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(globalStats, nav);
}

// 修改章节统计样式
document.querySelectorAll('section').forEach(section => {
    section.querySelector('.article-stats')?.remove();
    const stats = countArticleStats(section);
    const statsBar = document.createElement('div');
    statsBar.className = 'article-stats';
    statsBar.innerHTML = `
        <span class="stat-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M13 3H7v2h6V3m-6 10h2v6h-2v-6m2-2H7v2h2v-2m8-6h-2v8h2V5m0 10h-2v4h2v-4m4-10H3v18h18V3m2 20H1V1h22v22Z"/></svg>
            <span class="stat-text">${stats.wordCount.toLocaleString()}字</span>
        </span>
        <span class="stat-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 17H7v-2h7v2m3-4H7v-2h10v2m0-4H7V7h10v2m2-4H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m0 16H5V5h14v14Z"/></svg>
            ${stats.codeBlocks}个代码块
        </span>
        <span class="stat-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 17H7v-2h7v2m3-4H7v-2h10v2m0-4H7V7h10v2m2-4H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m0 16H5V5h14v14Z"/></svg>
            ${stats.codeLines}行代码
        </span>
    `;
    section.querySelector('h1').after(statsBar);
});

// 初始化全局统计
addGlobalStats();

// 强制刷新统计
document.querySelectorAll('section').forEach(section => {
    section.querySelector('.article-stats')?.remove();
    const stats = countArticleStats(section);
    const statsBar = document.createElement('div');
    statsBar.className = 'article-stats';
    statsBar.innerHTML = `
        <span class="stat-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M13 3H7v2h6V3m-6 10h2v6h-2v-6m2-2H7v2h2v-2m8-6h-2v8h2V5m0 10h-2v4h2v-4m4-10H3v18h18V3m2 20H1V1h22v22Z"/></svg>
            <span class="stat-text">${stats.wordCount.toLocaleString()}字</span>
        </span>
        <span class="stat-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 17H7v-2h7v2m3-4H7v-2h10v2m0-4H7V7h10v2m2-4H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m0 16H5V5h14v14Z"/></svg>
            ${stats.codeBlocks}个代码块
        </span>
        <span class="stat-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 17H7v-2h7v2m3-4H7v-2h10v2m0-4H7V7h10v2m2-4H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m0 16H5V5h14v14Z"/></svg>
            ${stats.codeLines}行代码
        </span>
    `;
    section.querySelector('h1').after(statsBar);
}); 