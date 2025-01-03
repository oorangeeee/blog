document.addEventListener('DOMContentLoaded', async () => {
    const articles = [];
    // 获取html文件列表
    const response = await fetch('../html/filelist.json');
    const fileList = await response.json();
    // 输出fileList到控制台
    console.log('File list:', fileList);
    for (const file of fileList) {
        const res = await fetch(`../html/${file}`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const title = doc.querySelector('head > title').textContent; // 获取文章标题
        const lastEditedMatch = doc.querySelector('body > footer.last-edit > p').textContent.match(/最后编辑时间: ([\d-]+\s[\d:]+)/);
        const lastEdited = lastEditedMatch ? lastEditedMatch[1] : null; // 提取时间
        if (lastEdited) {
            articles.push({ title, lastEdited, link: `html/${file}` });
        }
    }
    // 按照时间排序，越新的越靠上
    articles.sort((a, b) => new Date(b.lastEdited.replace(/-/g, '/')) - new Date(a.lastEdited.replace(/-/g, '/')));
    // 输出到控制台
    console.log('Sorted articles:', articles);

    const articlesContainer = document.getElementById('articles');
    // 设置容器的样式为居中
    articlesContainer.style.display = 'flex';
    articlesContainer.style.flexDirection = 'column';
    articlesContainer.style.alignItems = 'center';
    articlesContainer.style.justifyContent = 'center';

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article';
        articleElement.style.textAlign = 'center'; // 居中显示文字

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
