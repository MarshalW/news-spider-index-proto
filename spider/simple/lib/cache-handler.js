import Crawler from "simplecrawler"
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import logger from './logger'

export default function cacheHandler(spider, rootPath) {
    logger.info({
        initialURL: spider.initialURL
    })

    let cacheDir = crypto.createHash('md5').update(spider.initialURL).digest("hex")
    let cachePath = path.join(rootPath, cacheDir)

    fs.mkdir(cachePath, { recursive: true }, (err) => {
        if (err) throw err;
    });

    spider.cache = new Crawler.cache(cachePath)

    spider.on('notmodified', function (queueItem, response, cacheObject) {
        logger.info({
            notmodified: {
                url: queueItem.url
            }
        })
    })
}