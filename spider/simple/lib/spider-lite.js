import Crawler from "simplecrawler"
import logger from './logger'
import errorHandler from './error-handler'
import cacheHandler from './cache-handler'
import exitHandler from './exit-handler'
import debug from './spider-debug'
import path from 'path'

const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"

export default class {
    constructor(params) {
        let { urls, maxDepth, timeout, interval, maxConcurrency, respectRobotsTxt } = params
        this.urls = urls
        this.maxDepth = maxDepth
        this.timeout = timeout
        this.interval = interval
        this.maxConcurrency = maxConcurrency
        this.respectRobotsTxt = respectRobotsTxt
    }
    onFetchComplete(queueItem, responseBuffer, response) {
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

            if (this.maxConcurrency) {
                spider.maxConcurrency = this.maxConcurrency
            }

            if (this.respectRobotsTxt != null) {
                spider.respectRobotsTxt = this.respectRobotsTxt
            }

            debug(spider)

            // spider.cache = new Crawler.cache('./cache')

            let promise = new Promise((resolve, reject) => {
                spider.on('complete', () => {
                    logger.info({
                        status: {
                            type: 'complete'
                        }
                    })
                    resolve()
                })
            })
            promises.push(promise)

            spider.on('fetchcomplete', this.onFetchComplete.bind(this))

            exitHandler(spider)
            errorHandler(spider)
            cacheHandler(spider, path.join(__dirname, '../cache'))

            spider.start()

            logger.info({
                status: {
                    info: 'Spider started ' + spider.initialURL,
                    spider
                }
            })
        })

        return Promise.all(promises)
    }
}