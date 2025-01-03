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

        const title = doc.querySelector('head > title').textContent;
        const lastEdited = doc.querySelector('body > footer.last-edit > p').textContent.match(/最后编辑时间: (.+)/)[1];

        articles.push({ title, lastEdited, link: `html/${file}` });
    }

    // 按照时间排序，越新的越靠上
    articles.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));

    // 输出到控制台
    console.log(articles);

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
