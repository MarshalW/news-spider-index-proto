import Crawler from "simplecrawler"
import logger from './logger.js'
import cheerio from "cheerio"
import _ from 'lodash'
import getMeta from "lets-get-meta"
import moment from 'moment'
import htmlToText from 'html-to-text'

export default class {
    constructor(params) {
        let { url } = params

        this.url = url
    }
    onFetchComplete(queueItem, responseBuffer, response) {
        let news = this.parseNews(responseBuffer)

        if (news != null) {
            // logger.info(`Url: ${queueItem.url}\n Date: ${news.publishDate}, Title: ${news.title}\n Content: ${news.content}`)
            let { url } = queueItem
            let { contentId, title, content, publishDate } = news
            content = htmlToText.fromString(news.content, { ignoreHref: true, ignoreImage: true, hideLinkHrefIfSameAsText: true })
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
    start() {
        this.spider = new Crawler(this.url)
        this.spider.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
        this.spider.on('fetchcomplete', this.onFetchComplete.bind(this))
        this.spider.on('complete', this.onComplete)

        this.spider.start()
        logger.info({
            status: `Spider started.`
        })
    }
    parseNews(html) {
        let $ = cheerio.load(html)
        let meta = getMeta(html)
        let news = {}
        let titleSelectors = ['.articleTitle', '.artiTitle', '.artTitle']

        // 获取新闻题目
        titleSelectors.forEach((item) => {
            let title = _.trim($(item).text())
            if (title.length > 0) {
                if (title.indexOf('(') != -1) {
                    title = title.substring(0, title.indexOf('('))
                }
                news.title = title
            }
        })

        // 获取新闻内容id
        if (meta.contentid) {
            news.contentId = meta.contentid
        } else if ($('articleid')) {
            news.contentId = $('articleid').text()
        }

        // 获取发布日期
        if (meta.publishdate) {
            news.publishDate = moment(meta.publishdate, "YYYY-MM-DD").valueOf()
        }

        // 获取新闻内容
        let contentStart = '<!--enpcontent-->'
        let contentEnd = '<!--/enpcontent-->'
        let htmlString = html.toString()
        if (htmlString.includes(contentStart) && htmlString.includes(contentEnd)) {
            let start = htmlString.indexOf(contentStart) + contentStart.length
            let end = htmlString.indexOf(contentEnd)
            news.content = htmlString.substring(start, end)
        }

        // 检查解析是否可用
        if (news.contentId && news.title && news.publishDate && news.content) {
            return news
        }

        return null
    }
}