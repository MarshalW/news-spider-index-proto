// import httpServer from 'http-server'

// let server = httpServer.createServer({
//     root: './mock',
// });

// server.listen(9999)

import { describe } from 'mocha'
import assert from 'assert'
import httpServer from 'http-server'
import Spider from '../lib/spider-lite'

describe('Simple test suite:', function () {
    let server
    this.timeout(10 * 1000)

    before(() => {
        server = httpServer.createServer({
            root: './mock',
        })
        server.listen(9999)
        console.log('server started.')
    })

    after(() => {
        server.close()
    })

    it('Spider is not null', function () {
        assert(Spider != null)
    })

    it('Spider run ok', async function () {
        let config = {
            urls: ['http://localhost:9999/target_1/index.html'],
            maxDepth: 5
        }
        await new Spider(config).start()
    })
})