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
./bin/start-spider
```

将创建 ./logs/response.log 日志文件，目前临时使用，后期将转为数据库存储

