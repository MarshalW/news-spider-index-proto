// import httpServer from 'http-server'

// let server = httpServer.createServer({
//     root: './mock',
// });

// server.listen(9999)

import { describe } from 'mocha'
import assert from 'assert'
import httpServer from 'http-server'
import Spider from '../lib/spider'

describe('Simple test suite:', function () {
    let server

    before(() => {
        server = httpServer.createServer({
            root: './mock',
        })
        server.listen(9999)
        console.log('server started.')
    })

    it('Spider is not null', function () {
        assert(Spider != null)
    })

    it('Spider run ok', function () {
        let config = {
            urls: ['http://localhost:9999/target_1/index.html'],
            maxDepth: 5
        }
        new Spider(config).start()
    })
})