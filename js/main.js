document.addEventListener('DOMContentLoaded', () => {
    const articles = [
        { title: '欢迎来到我的博客', lastEdited: '2025-01-03', link: 'html/welcome.html' },
    ];

    // 按照时间排序，越新的越靠上
    articles.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));

    const articlesContainer = document.getElementById('articles');

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article';

        const titleElement = document.createElement('h2');
        titleElement.style.fontFamily = '标题, Arial, sans-serif';
        const linkElement = document.createElement('a');
        linkElement.href = article.link;
        linkElement.target = '_blank'; // 在新标签页中打开链接
        linkElement.textContent = article.title;
        titleElement.appendChild(linkElement);

        const timeElement = document.createElement('time');
        timeElement.textContent = `最后编辑时间: ${article.lastEdited}`;

        articleElement.appendChild(titleElement);
        articleElement.appendChild(timeElement);

        articlesContainer.appendChild(articleElement);
    });
});
