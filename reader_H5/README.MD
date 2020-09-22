# 阅读器开发过程

1. 电子书渲染

- EbookReader
- 电子书解析渲染
- 手势翻页

3. 菜单标题

- EbookTitle
- EbookMenu
- 集成 ebookMixin,对组件进行解耦

4. 菜单功能

- 字体字号设置
  - EbookSettingFont
- localStorage 缓存
- i18n 国际化
- 主题设置
  - EbookSettingTheme
  - 通过 epubjs 实现(注册，切换主题)

5. 阅读进度功能

- EbookSettingProgress
- epubjs 的 locations 对象实现章节定位
- 上一章、下一章
- 获取当前章节名称
- 阅读时间

6. 目录功能

- EbookSlideContent
- 解析电子书内容(封面、章节、标题、作者)
- 获取目录内容(flatten 数组扁平化,find 缩进展示树)
- 全文搜索功能
- 搜索关键字，高亮显示
- 跳转到搜索内容，关键字高亮显示(二维数组，转为一维数组)

7. 书签功能

- 手势操作(下拉回弹)
- 获取书签所在页的文本内容
- 添加删除书签
- 鼠标事件支持

8. 章节分页
