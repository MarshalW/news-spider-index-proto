import logger from './logger'

export default function exitHandler(spider) {
    // 正常退出
    process.on('exit', function (code) {
        logger.info({
            status: {
                type: 'exit',
                code
            }
        })
    })
    // SIGTERM: kill -9
    process.on('SIGTERM', function (code) {
        logger.info({
            status: {
                type: 'exit',
                code,
                spider
            }
        })
    })
}