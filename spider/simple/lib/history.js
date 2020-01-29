import Database from 'better-sqlite3'

const DB_PATH = './db/history.db'

export default class {
    constructor() {

    }

    insert(news) {
        const stmt = this.db.prepare(`
            INSERT INTO SPIDER_HISTORY 
                (content_id, publish_date, create_date, url, content_hash) 
            VALUES (
                @contentId, 
                @publishDate, 
                ?,
                @url,
                @contentHash)
        `)

        stmt.run(new Date().getTime(), news)
    }

    updateAbandoned(url, contentHash) {
        const stmt = this.db.prepare(`
            update SPIDER_HISTORY 
                set abandoned=TRUE, update_date=?
                where url=? and content_hash=?
        `)

        stmt.run(new Date().getTime(), url, contentHash)
    }

    queryByUrl(url) {
        const stmt = this.db.prepare('select content_hash from SPIDER_HISTORY where url=? and abandoned is FALSE')
        let result = stmt.get(url)
        return result
    }

    init() {
        this.db = new Database(DB_PATH)

        // 设置关闭数据库的回调
        process.on('exit', () => {
            this.db.close()
        })
        process.on('SIGHUP', () => process.exit(128 + 1))
        process.on('SIGINT', () => process.exit(128 + 2))
        process.on('SIGTERM', () => process.exit(128 + 15))
    }
}