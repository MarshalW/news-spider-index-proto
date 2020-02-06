import logger from './logger'

export default function errorHandler(spider) {
    spider.on("fetchdataerror", function (queueItem) {
        logger.error({
            error: {
                type: 'fetchdataerror',
                url: queueItem.url
            }
        })
    })
        .on("fetch404", function (queueItem, responseBuffer) {
            logger.error({
                error: {
                    type: 'fetch404',
                    url: queueItem.url
                }
            })
        })
        .on("fetch410", function (queueItem, response) {
            logger.error({
                error: {
                    type: 'fetch410',
                    url: queueItem.url
                }
            })
        })
        .on("fetcherror", function (queueItem, response) {
            logger.error({
                error: {
                    type: 'fetcherror',
                    url: queueItem.url
                }
            })
        })
        .on("fetchtimeout", function (queueItem, timeoutVal) {
            logger.error({
                error: {
                    type: 'fetchtimeout',
                    url: queueItem.url
                }
            })
        })
        .on("fetchredirect", function (queueItem, parsedUrl, response) {
            logger.info({
                redirect: {
                    url: queueItem.url
                }
            })
        })
        .on("fetchclienterror", function (queueItem, error) {
            logger.error({
                error: {
                    type: 'fetchclienterror',
                    url: queueItem.url,
                    detail: error
                }
            })
        })
        .on("queueerror", function (error, queueItem) {
            logger.error({
                error: {
                    type: 'queueerror',
                    url: queueItem.url,
                    detail: error
                }
            })
        })
}