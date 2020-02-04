import Crawler from "simplecrawler"
import logger from './logger.js'

const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"

export default class {
    constructor(params) {
        let { urls, maxDepth, timeout, interval } = params
        this.urls = urls
        this.maxDepth = maxDepth
        this.timeout = timeout
        this.interval = interval
    }
    onFetchComplete(queueItem, responseBuffer, response) {
        // responseBuffer
        let { url } = queueItem
        let content = responseBuffer.toString()

        logger.info({
            response: {
                url, content
            }
        })
    }
    start() {
        let promises = []
        this.urls.forEach(url => {
            let spider = new Crawler(url)

            spider.userAgent = USER_AGENT
            // spider.maxConcurrency = 5
            // spider.timeout = 60 * 1000
            // spider.interval = 1 * 1000

            // spider.maxDepth = 5
            if (this.maxDepth) {
                spider.maxDepth = this.maxDepth
            }

            if (this.timeout) {
                spider.timeout = this.timeout
            }

            if (this.interval) {
                spider.interval = this.interval
            }

            // spider.cache = new Crawler.cache('./cache')

            let promise = new Promise((resolve, reject) => {
                spider.on('complete', () => {
                    logger.info({
                        status: `A Spider finished.`
                    })
                    resolve()
                })
            })
            promises.push(promise)

            spider.on('fetchcomplete', this.onFetchComplete.bind(this))

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
        })

        logger.info({
            status: `Spider started.`
        })

        return Promise.all(promises)
    }
}