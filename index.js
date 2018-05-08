'use strict'

const botCore = require('pinyin-bot-core')
const Bot = require('messenger-bot')
const http = require('http')
const ip = require('ip')
 
let bot = new Bot({
  token: process.env.PINYIN_MESSENGER_TOKEN,
  verify: process.env.PINYIN_MESSENGER_VERIFY,
  app_secret: process.env.PINYIN_MESSENGER_APP_SECRET
})
 
bot.on('error', (err) => {
  console.log(err.message)
})
 
bot.on('message', (payload, reply) => {
  let text = payload.message.text
  botCore.processMessage(text, (res) => {
  	reply({text: res})
  })
})
 
const port = Number(process.env.PORT || 8080)
http.createServer(bot.middleware()).listen(port, ip.address(), err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server running on http://${ip.address()}:${port}`)
})
