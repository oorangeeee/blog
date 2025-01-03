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
        const articleLink = document.createElement('a');
        articleLink.href = article.link;
        articleLink.target = '_blank'; // 在新标签页中打开链接
        articleLink.style.textDecoration = 'none'; // 去掉默认下划线
        articleLink.style.color = 'inherit'; // 继承颜色，避免文字颜色变化
        articleLink.style.display = 'block'; // 将链接设置为块级元素，包裹整个标签

        const articleElement = document.createElement('div');
        articleElement.className = 'article';
        articleElement.style.textAlign = 'center'; // 居中显示文字
        articleElement.style.borderRadius = '12px'; // 添加圆角
        articleElement.style.margin = '1rem 0'; // 每个标签间增加间距
        articleElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // 添加阴影
        articleElement.style.padding = '1rem'; // 内边距
        articleElement.style.width = 'clamp(70%, 95vw, 95%)'; // 使用动态宽度
        articleElement.style.backgroundColor = '#ffffff'; // 设置白色背景
        articleElement.style.transition = 'transform 0.3s'; // 添加过渡效果
        articleElement.onmouseover = () => articleElement.style.transform = 'scale(1.03)'; // 鼠标悬停时放大
        articleElement.onmouseout = () => articleElement.style.transform = 'scale(1)'; // 鼠标移开恢复

        const titleElement = document.createElement('h2');
        titleElement.style.fontFamily = '标题, Arial, sans-serif';
        titleElement.textContent = article.title;

        const timeElement = document.createElement('time');
        timeElement.textContent = `最后编辑时间: ${article.lastEdited}`;
        timeElement.style.display = 'block';
        timeElement.style.marginTop = '0.5rem';
        timeElement.style.color = '#888'; // 时间文本颜色

        // 将标题和时间放入标签内
        articleElement.appendChild(titleElement);
        articleElement.appendChild(timeElement);

        // 将整个 div 包裹在链接中
        articleLink.appendChild(articleElement);
        articlesContainer.appendChild(articleLink);
    });
});
