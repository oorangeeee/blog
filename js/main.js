document.addEventListener('DOMContentLoaded', async () => {
    const topArticles = []; // 置顶文章队列
    const normalArticles = []; // 普通文章队列

    // 获取 HTML 文件列表
    const response = await fetch('../html/filelist.json');
    const fileList = await response.json();
    console.log('File list:', fileList);

    for (const file of fileList) {
        const res = await fetch(`../html/${file}`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // 获取文章标题
        const title = doc.querySelector('head > title').textContent;

        // 获取最后编辑时间
        const lastEditedMatch = doc.querySelector('body > footer.last-edit > p').textContent.match(/最后编辑时间: ([\d-]+\s[\d:]+)/);
        const lastEdited = lastEditedMatch ? lastEditedMatch[1] : null;

        // 获取优先级（priority 元数据）
        const priorityMeta = doc.querySelector('meta[name="priority"]');
        const priority = priorityMeta ? priorityMeta.getAttribute('content') : 'normal';

        if (lastEdited) {
            const articleData = { title, lastEdited, link: `html/${file}`, priority };

            // 根据优先级将文章加入不同的队列
            if (priority === 'top') {
                topArticles.push(articleData);
            } else {
                normalArticles.push(articleData);
            }
        }
    }

    // 排序置顶文章队列：按时间倒序（越新越靠上）
    topArticles.sort((a, b) => new Date(b.lastEdited.replace(/-/g, '/')) - new Date(a.lastEdited.replace(/-/g, '/')));

    // 排序普通文章队列：按时间倒序（越新越靠上）
    normalArticles.sort((a, b) => new Date(b.lastEdited.replace(/-/g, '/')) - new Date(a.lastEdited.replace(/-/g, '/')));

    console.log('Sorted top articles:', topArticles);
    console.log('Sorted normal articles:', normalArticles);

    // 渲染文章到页面
    const articlesContainer = document.getElementById('articles');
    articlesContainer.style.display = 'flex';
    articlesContainer.style.flexDirection = 'column';
    articlesContainer.style.alignItems = 'center';
    articlesContainer.style.justifyContent = 'center';

    // 渲染置顶文章
    topArticles.forEach(article => {
        const articleLink = createArticleElement(article);
        articlesContainer.appendChild(articleLink);
    });

    // 渲染普通文章
    normalArticles.forEach(article => {
        const articleLink = createArticleElement(article);
        articlesContainer.appendChild(articleLink);
    });
});

// 创建文章元素的函数
function createArticleElement(article) {
    // 外层链接元素，包裹整个标签
    const articleLink = document.createElement('a');
    articleLink.href = article.link;
    articleLink.target = '_blank'; // 在新标签页中打开链接
    articleLink.style.textDecoration = 'none'; // 去掉默认下划线
    articleLink.style.color = 'inherit'; // 继承颜色，避免文字颜色变化
    articleLink.style.display = 'block'; // 将链接设置为块级元素，包裹整个标签
    articleLink.style.width = 'clamp(70%, 95vw, 900px)'; // 宽度动态调整，最小 70%，最大 900px
    articleLink.style.margin = '1rem 0'; // 每个标签间增加间距

    // 内层标签
    const articleElement = document.createElement('div');
    articleElement.className = 'article';
    articleElement.style.textAlign = 'center'; // 居中显示文字
    articleElement.style.borderRadius = '12px'; // 添加圆角
    articleElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // 添加阴影
    articleElement.style.padding = '1rem'; // 内边距
    articleElement.style.backgroundColor = '#ffffff'; // 设置白色背景
    articleElement.style.transition = 'transform 0.3s'; // 添加过渡效果
    articleElement.onmouseover = () => articleElement.style.transform = 'scale(1.03)'; // 鼠标悬停时放大
    articleElement.onmouseout = () => articleElement.style.transform = 'scale(1)'; // 鼠标移开恢复

    // 文章标题容器
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex'; // 使用 flex 布局，方便加入图标
    titleContainer.style.alignItems = 'center'; // 垂直居中对齐

    // 如果是置顶文章，添加置顶图标
    if (article.priority === 'top') {
        const topIcon = document.createElement('span');
        topIcon.textContent = '📌'; // 置顶图标，可以替换为其他符号或图片
        topIcon.style.marginRight = '0.5rem'; // 图标与标题之间的间距
        topIcon.style.color = '#ff4500'; // 图标颜色，可根据需要调整
        topIcon.style.fontSize = '1.2rem'; // 图标大小
        titleContainer.appendChild(topIcon); // 添加图标到标题容器
    }

    // 文章标题
    const titleElement = document.createElement('h2');
    titleElement.style.fontFamily = '标题, Arial, sans-serif';
    titleElement.style.margin = '0'; // 去掉标题的默认外边距
    titleElement.textContent = article.title;
    titleContainer.appendChild(titleElement); // 将标题添加到标题容器

    // 时间信息
    const timeElement = document.createElement('time');
    timeElement.textContent = `最后编辑时间: ${article.lastEdited}`;
    timeElement.style.display = 'block';
    timeElement.style.marginTop = '0.5rem';
    timeElement.style.color = '#888'; // 时间文本颜色

    // 将标题容器和时间添加到内层标签
    articleElement.appendChild(titleContainer);
    articleElement.appendChild(timeElement);

    // 将内层标签添加到链接元素
    articleLink.appendChild(articleElement);

    return articleLink;
}
