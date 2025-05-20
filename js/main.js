document.addEventListener('DOMContentLoaded', async () => {
    let currentColumn = '主页';
    const topArticles = [];
    const normalArticles = [];

    // 专栏配置
    const columns = [
        {
            name: '主页',
            isHome: true // 特殊标记主页
        },
        {
            name: '技术',
            filesPath: 'technical_files.json'
        },
        {
            name: '生活',
            filesPath: 'life_files.json'
        },
        {
            name: '游戏',
            filesPath: 'game_files.json'
        }
    ];

    // 侧边栏控制
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const closeButton = document.querySelector('.close-sidebar');

    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        sidebar.classList.add('active');
        mainContent.classList.add('shifted');
        sidebarToggle.style.opacity = '0';
        sidebarToggle.style.pointerEvents = 'none';
    });

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        closeSidebar();
    });

    // 抽取关闭侧边栏的逻辑为单独函数
    function closeSidebar() {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
        sidebarToggle.style.opacity = '1';
        sidebarToggle.style.pointerEvents = 'auto';
    }

    // 点击侧边栏外区域关闭侧边栏
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) &&
            !sidebarToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // 加载栏目列表
    const columnList = document.getElementById('column-list');
    columns.forEach(column => {
        const columnItem = document.createElement('a');
        columnItem.className = 'column-item';
        columnItem.textContent = column.name;
        columnItem.href = '#';
        if (column.isHome) {
            columnItem.setAttribute('data-is-home', 'true');
        }
        if (column.name === currentColumn) {
            columnItem.classList.add('active');
        }

        columnItem.addEventListener('click', async (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            e.preventDefault();
            document.querySelectorAll('.column-item').forEach(item => {
                item.classList.remove('active');
            });
            columnItem.classList.add('active');
            currentColumn = column.name;
            await loadArticles(column);

            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });

        columnList.appendChild(columnItem);
    });

    // 加载文章列表
    async function loadArticles(column) {
        topArticles.length = 0;
        normalArticles.length = 0;

        try {
            let fileList = [];
            if (column.isHome) {
                const allColumnFiles = columns
                    .filter(col => !col.isHome)
                    .map(col => fetch(`../html/${col.filesPath}`));

                const responses = await Promise.all(allColumnFiles);
                const jsonResults = await Promise.all(responses.map(res => res.json()));
                fileList = jsonResults.flat();
            } else {
                const response = await fetch(`../html/${column.filesPath}`);
                fileList = await response.json();
            }

            // 处理文章列表
            for (const file of fileList) {
                try {
                    const res = await fetch(`../html/${file}`);
                    const text = await res.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');

                    // 检查是否存在隐藏标记
                    const hideMeta = doc.querySelector('meta[name="ifHide"]');
                    if (hideMeta && hideMeta.getAttribute('content') === 'hide') {
                        console.log(`文件 ${file} 被标记为隐藏，跳过加载`);
                        continue;
                    }

                    // 使用更宽松的选择器
                    const titleElement = doc.querySelector('title');
                    if (!titleElement) {
                        console.error(`文件 ${file} 缺少 <title> 标签`);
                        continue;
                    }

                    const footerElement = doc.querySelector('footer.last-edit p');
                    if (!footerElement) {
                        console.error(`文件 ${file} 缺少 footer.last-edit 元素或其中的 p 元素`);
                        continue;
                    }

                    const title = titleElement.textContent;
                    const lastEditedMatch = footerElement.textContent.match(/最后编辑时间: ([\d-]+\s[\d:]+)/);

                    if (!lastEditedMatch) {
                        console.error(`文件 ${file} 的时间格式不正确，应为: "最后编辑时间: YYYY-MM-DD HH:mm:ss"`);
                        continue;
                    }

                    const lastEdited = lastEditedMatch[1];
                    // 检查时间是否合法
                    const editDate = new Date(lastEdited.replace(/-/g, '/'));
                    if (isNaN(editDate.getTime()) || editDate > new Date()) {
                        console.error(`文件 ${file} 的时间 ${lastEdited} 无效或是未来时间`);
                        continue;
                    }

                    const priorityMeta = doc.querySelector('meta[name="priority"]');
                    const priority = priorityMeta ? priorityMeta.getAttribute('content') : 'normal';

                    if (priority !== 'normal' && priority !== 'top') {
                        console.warn(`文件 ${file} 的 priority 值 "${priority}" 无效，将使用 "normal"`);
                    }

                    const articleData = { title, lastEdited, link: `html/${file}`, priority };

                    if (priority === 'top') {
                        topArticles.push(articleData);
                    } else {
                        normalArticles.push(articleData);
                    }

                } catch (err) {
                    console.error(`处理文件 ${file} 时发生错误:`, err);
                    continue;
                }
            }

            // 排序置顶文章队列：按时间倒序（越新越靠上）
            topArticles.sort((a, b) => new Date(b.lastEdited.replace(/-/g, '/')) - new Date(a.lastEdited.replace(/-/g, '/')));

            // 排序普通文章队列：按时间倒序（越新越靠上）
            normalArticles.sort((a, b) => new Date(b.lastEdited.replace(/-/g, '/')) - new Date(a.lastEdited.replace(/-/g, '/')));

            console.log('Sorted top articles:', topArticles);
            console.log('Sorted normal articles:', normalArticles);

            // 清空并重新渲染文章列表
            const articlesContainer = document.getElementById('articles');
            articlesContainer.innerHTML = '';

            topArticles.forEach(article => {
                const articleLink = createArticleElement(article);
                articlesContainer.appendChild(articleLink);
            });

            normalArticles.forEach(article => {
                const articleLink = createArticleElement(article);
                articlesContainer.appendChild(articleLink);
            });

        } catch (err) {
            console.error('加载文章列表时发生错误:', err);
            const articlesContainer = document.getElementById('articles');
            articlesContainer.innerHTML = '<div class="error">加载文章列表失败，请刷新页面重试</div>';
        }
    }

    // 初始加载主页文章
    await loadArticles(columns[0]);
});

function createArticleElement(article) {
    // 外层链接元素，包裹整个标签
    const articleLink = document.createElement('a');
    articleLink.href = article.link;
    articleLink.target = '_blank'; // 在新标签页中打开链接
    articleLink.style.textDecoration = 'none'; // 去掉默认下划线
    articleLink.style.color = 'inherit'; // 继承颜色，避免文字颜色变化
    articleLink.style.display = 'block'; // 将链接设置为块级元素，包裹整个标签
    articleLink.style.width = 'min(900px, 95%)'; // 修改宽度设置，确保移动端不会溢出
    articleLink.style.margin = '1rem auto'; // 使用 auto 实现水平居中

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
    titleContainer.style.display = 'inline-flex'; // 使用 inline-flex 布局
    titleContainer.style.alignItems = 'center'; // 垂直居中对齐
    titleContainer.style.justifyContent = 'center'; // 水平居中对齐
    titleContainer.style.width = '100%'; // 确保容器宽度占满，整体居中

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
