import logger from './logger'

export default function exitHandler(spider) {
    process.on('exit', function (code) {
        logger.info({
            status: {
                type: 'exit',
                code,
                spider
            }
        })
    })
}