import Spider from './lib/spider-lite'
import yaml from 'js-yaml'
import fs from 'fs'

const config = yaml.safeLoad(fs.readFileSync('../../config/spider.yml', 'utf8'))

new Spider(config).start().then(() => {
    process.exit(0)
})





