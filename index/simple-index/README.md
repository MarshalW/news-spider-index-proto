# 全文检索简单实现

## 构建

需要先安装 gradle。

命令：

```$xslt
gradle shadowjar
```

## 运行

创建索引：

```shell script
./bin/index  ../../logs/news.log
```

执行搜索：

```shell script
./bin/search
```

## 存在问题

- `build.gradle` 需要做调整，有一些配置在后续 7.0 将不被支持
- 目前架构已经支持基于 spring 的工厂和 ioc 配置，看了下其他分析器都很容易适配（比 ik 简单），暂时不加进来了，并不难，不必编码，配置就好了
- index file path 通过 ioc 设置
- 需要考虑关闭 Directory
- 搜索功能，在打包为单一 jar 时报错，不可用
    - https://stackoverflow.com/a/29615171/3483986
    - 