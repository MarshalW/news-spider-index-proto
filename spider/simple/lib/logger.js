import winston from 'winston'
const { createLogger, transports, format } = winston
const { combine, timestamp, json } = format

export default createLogger({
    level: 'debug',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        json(),
    ),
    transports: [
        new transports.Console({
            // format
        })
    ]
})
