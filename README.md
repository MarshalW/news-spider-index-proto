# 新闻爬虫和索引服务原型

## 要求

需要安装：

- node.js v13.x
- java SDK
- gradle
- sqlite3

### gradle

在 maxOS 下

```
brew install gradle
```

### linux 下编译问题的解决

可能会出现这样的问题：

```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! integer@2.1.0 install: `node-gyp rebuild`
..
```

这是因为 npm 自带的 `node-gyp` 版本不够新造成的。

需要单独升级 node-gyp：

```
npm explore npm -g -- npm install node-gyp@latest
```

## 命令执行

### 安装和构建

执行安装构建命令：

```
./bin/build
```

### 爬虫生成日志

配置文件，./config/spider.yml, 设置爬虫的入口，可以有多个 url

```yml
urls:
  - http://news.china.com.cn/node_7247300.htm
```

执行：

```
./bin/spider
```

将创建 ./logs/news.log 日志文件，格式类似：

```
> simple@0.0.1 start /Users/marshal/Projects/news-spider-index-proto/spider/simple
> node app

{"message":{"status":"Spider started."},"level":"info","timestamp":"2020-01-23 15:05:20.177"}
{"message":{"news":{"contentId":"75643856","title":"疫情牵动人心 多部门出台举措合力防控新型肺炎","content":"新华社北京1月23日电（记者田晓航、屈婷）截至1月22日24时，...，注意休息，勿过疲劳。","publishDate":1579708800000,"url":"http://news.china.com.cn/2020-01/23/content_75643856.htm"}},"level":"info","timestamp":"2020-01-23 15:05:20.801"}
...
```

### 创建索引

执行：

```
./bin/index
```

将根据 ./logs/news.log 创建多种分词的多个 lucene 索引文件。

### 执行简单的关键字搜索

命令：

```
./bin/search 肺炎
```

将迭代多个分词索引，分别给出最多前 5 条结果。
