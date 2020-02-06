import logger from './logger'

export default function errorHandler(spider) {
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
        .on("fetchclienterror", function (queueItem, error) {
            logger.error({
                error: {
                    url: queueItem.url,
                    detail: error
                }
            })
        })
}