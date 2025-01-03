document.addEventListener('DOMContentLoaded', () => {
    const articles = [
        { title: '文章一', lastEdited: '2023-10-01', link: 'html/article1.html' },
        { title: '文章二', lastEdited: '2023-10-05', link: 'html/article2.html' },
        { title: '文章三', lastEdited: '2023-10-10', link: 'html/article3.html' }
    ];

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
