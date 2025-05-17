import os
import re
from datetime import datetime
from bs4 import BeautifulSoup


def update_article():
    # 获取用户输入的文件名
    filename = input("请输入HTML文件名: ")
    file_path = os.path.join("html", filename)

    if not os.path.exists(file_path):
        print(f"文件 {file_path} 不存在")
        return

    # 读取HTML文件
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")

    # 找到所有section标签并提取id
    sections = soup.find_all("section")
    section_ids = []
    for section in sections:
        if section.get("id"):
            section_ids.append(section["id"])

    # 更新或创建目录
    nav = soup.find("nav")
    if not nav and section_ids:
        # 创建新的nav标签
        nav = soup.new_tag("nav")
        h2 = soup.new_tag("h2")
        h2.string = "目录"
        nav.append(h2)
        ul = soup.new_tag("ul")
        nav.append(ul)
        # 将nav插入到main的开头
        main = soup.find("main")
        if main:
            main.insert(0, nav)
    elif nav:
        # 清空现有目录
        ul = nav.find("ul")
        if not ul:
            ul = soup.new_tag("ul")
            nav.append(ul)
        else:
            ul.clear()
        # 添加新目录项
        for section_id in section_ids:
            li = soup.new_tag("li")
            a = soup.new_tag("a", href=f"#{section_id}")
            a.string = section_id
            li.append(a)
            ul.append(li)

    # 更新或创建最后编辑时间
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    last_edit = soup.find("footer", class_="last-edit")
    if not last_edit:
        # 创建新的footer
        last_edit = soup.new_tag("footer", attrs={"class": "last-edit"})
        p = soup.new_tag("p")
        p.string = f"最后编辑时间: {current_time}"
        last_edit.append(p)
        # 将footer插入到body的末尾
        body = soup.find("body")
        if body:
            body.append(last_edit)
    else:
        last_edit.p.string = f"最后编辑时间: {current_time}"

    # 写回文件
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(str(soup))

    print("文件更新成功")


if __name__ == "__main__":
    update_article()
