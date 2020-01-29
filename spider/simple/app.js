import Spider from './lib/spider.js'
import yaml from 'js-yaml'
import fs from 'fs'

const config = yaml.safeLoad(fs.readFileSync('../../config/spider.yml', 'utf8'))
new Spider(config).start()



