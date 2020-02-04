# 简易新闻爬虫

## 运行

安装：

```
npm i
```

执行：

```
./bin/simple
```

## 问题

- 2020-2-4 方便的时候更换掉 http server，更新的太慢了，https://github.com/http-party/http-server/issues/537
  - 打算换这个：https://github.com/zeit/serve
- 2020-2-3 spider 和新闻内容的解析功能必须解耦
- 2020-1-29 当爬的新闻曾经爬过（数据库记录和日志），但是更新了（检查哈希），这部分没有测试，需要设计 test/mock
- 2020-1-29 爬虫正常退出逻辑，在不设置 maxDepth 情况下不能退出
