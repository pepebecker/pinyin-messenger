'use strict'

const http = require('http')
const Bot = require('messenger-bot')
const botCore = require('pinyin-bot-core')
 
let bot = new Bot(require('./options.json'))
 
bot.on('error', (err) => {
  console.log(err.message)
})
 
bot.on('message', (payload, reply) => {
  let text = payload.message.text
  botCore.processMessage(text, (res) => {
  	reply({text: res})
  })
})
 
http.createServer(bot.middleware()).listen(8081, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('Server running on port 8081')
})
