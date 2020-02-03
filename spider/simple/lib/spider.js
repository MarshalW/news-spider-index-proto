import Crawler from "simplecrawler"
import logger from './logger.js'
import htmlToText from 'html-to-text'
import crypto from 'crypto'

import History from './history.js'
import parseNews from './parser.js'

const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"

export default class {
    constructor(params) {
        let { urls, maxDepth } = params
        this.urls = urls
        this.maxDepth = maxDepth
        this.spiderCount = 0
    }
    onFetchComplete(queueItem, responseBuffer, response) {
        let news = parseNews(responseBuffer)

        if (news != null) {
            let { url } = queueItem
            let { contentId, title, content, publishDate } = news
            content = htmlToText.fromString(news.content, { ignoreHref: true, ignoreImage: true, hideLinkHrefIfSameAsText: true })

            news.url = url
            this.saveNews(news)

            logger.info({
                news: {
                    contentId, title, content, publishDate, url
                }
            })
        }
    }
    onComplete() {
        logger.info({
            status: `Spider finished.`
        })
    }
    initHistory() {
        this.history = new History()
        this.history.init()
    }
    start() {
        this.initHistory()
        this.urls.forEach(url => {
            let spider = new Crawler(url)

            spider.userAgent = USER_AGENT
            spider.maxConcurrency = 5
            spider.timeout = 60 * 1000

            // spider.maxDepth = 5
            if (this.maxDepth) {
                spider.maxDepth = this.maxDepth
            }

            // spider.cache = new Crawler.cache('./cache')

            spider.on('fetchcomplete', this.onFetchComplete.bind(this))
            spider.on('complete', () => {
                logger.info({
                    status: `A Spider finished.`
                })
                this.spiderCount--
                if (this.spiderCount == 0) {
                    logger.info({
                        status: `Spider End.`
                    })
                    process.exit(0)
                }
            })

            spider.on("fetchdataerror", function (queueItem) {
                logger.error({
                    error: {
                        message: `fetchdataerror: ${queueItem.url}`
                    }
                })
            })
                .on("fetch404", function (queueItem, responseBuffer) {
                    logger.error({
                        error: {
                            message: `fetch404: ${queueItem.url}`
                        }
                    })
                })
                .on("fetcherror", function (queueItem, responseBuffer) {
                    logger.error({
                        error: {
                            message: `fetcherror: ${queueItem.url}`
                        }
                    })
                })
                .on("fetchtimeout", function (queueItem, timeoutVal) {
                    logger.error({
                        error: {
                            message: `fetchtimeout: ${queueItem.url}`
                        }
                    })
                })
                .on("fetchredirect", function (queueItem, parsedUrl, response) {
                    logger.info({
                        redirect: {
                            message: `redirect to: ${queueItem.url}`
                        }
                    })
                })

            spider.start()
            this.spiderCount
        })

        logger.info({
            status: `Spider started.`
        })
    }
    saveNews(news) {
        news.contentHash = crypto.createHash('md5').update(news.content).digest("hex")
        let result = this.history.queryByUrl(news.url)

        // 新的文章
        if (result == null) {
            this.history.insert(news)
        } else {
            let oldContentHash = result.content_hash

            //新闻内容有更新，将设置旧记录废弃，并创建新记录
            if (oldContentHash != news.contentHash) {
                this.history.updateAbandoned(news.url, oldContentHash)
                this.history.insert(news)
                logger.info({
                    modified: {
                        url: news.url,
                        oldContentHash,
                        newContentHash: news.contentHash
                    }
                })
            }
        }
    }
}