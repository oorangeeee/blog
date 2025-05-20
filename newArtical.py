import os
import json
import uuid
from datetime import datetime


def create_html_file():
    # 获取用户输入的标题
    title = input("请输入文章标题: ")

    srcFile = input("请输入文章所属目录文件名称：")

    # 获取description和keywords
    description = input("请输入文章描述 (description): ")
    keywords = input("请输入文章关键词中间用空格隔开 (keywords): ")

    # 处理keywords为列表
    keywords_list = keywords.split()

    # 处理keywords为字符串
    keywords_str = ", ".join(keywords_list)

    # 设置 HTML 文件夹路径
    html_folder = "html"
    if not os.path.exists(html_folder):
        os.makedirs(html_folder)

    # 设置当前系统时间
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 使用 UUID 生成唯一的文件名
    file_name = uuid.uuid4().hex
    file_name = title+"-"+file_name+".html"
    file_path = os.path.join(html_folder, file_name)

    # HTML 内容模板
    html_content = f"""<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="priority" content="normal">
<meta name="description" content="{description}">
<meta name="keywords" content="{keywords_str}">
<meta name="author" content="橙子">
<meta content="" name="ifHide">
<title>{title}</title>
<link rel="stylesheet" href="../css/article.css">
<link rel="stylesheet" href="../css/beian.css">
<link rel="icon" href="../images/favicon.ico" type="image/x-icon">
</head>
<body>
<header>
<h1>{title}</h1>
</header>
<main>
<p>文章内容</p>
</main>
<footer class="beian-footer">
<div class="beian-info">
<img src="../images/备案图标.png" alt="备案图标" class="beian-icon">
<a href="https://beian.mps.gov.cn/#/query/webSearch?code=42011102005555" rel="noreferrer" target="_blank">鄂公网安备 42011102005555 </a>
<span class="spacer"> </span>
<a href="https://beian.miit.gov.cn/#/Integrated/index" rel="noreferrer" target="_blank" class="icp-beian">青ICP备2024002362号-1 </a>
</div>
</footer>
<footer class="last-edit">
<p>最后编辑时间: {current_time}</p>
</footer>
<script src="../js/article.js"></script>
</body>
</html>
"""

    # 将内容写入 HTML 文件
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(html_content)

    print(f"文件已生成: {file_path}")

    filelist_path = os.path.join(html_folder, srcFile)
    if not os.path.exists(filelist_path):
        print(f"{filelist_path} 文件不存在，正在创建一个新的 filelist.json")
        file_list = []
    else:
        # 读取 filelist.json 文件
        try:
            with open(filelist_path, "r", encoding="utf-8") as f:
                file_list = json.load(f)
            # 判断 filelist 是否为列表
            if not isinstance(file_list, list):
                raise ValueError("filelist.json 文件内容不是有效的列表格式")
        except Exception as e:
            print(f"读取 filelist.json 文件失败: {e}")
            return

    # 将新文件名追加到 filelist.json 中
    file_list.append(file_name)
    with open(filelist_path, "w", encoding="utf-8") as f:
        json.dump(file_list, f, indent=4, ensure_ascii=False)
    print(f"已更新 {filelist_path}，新增文件名: {file_name}")


if __name__ == "__main__":
    create_html_file()
