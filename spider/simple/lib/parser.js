import cheerio from "cheerio"
import _ from 'lodash'
import getMeta from "lets-get-meta"
import moment from 'moment'
import htmlToText from 'html-to-text'

export default function parse(html) {
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