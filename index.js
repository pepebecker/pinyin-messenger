'use strict'

const botCore = require('pinyin-bot-core')
const bodyParser = require('body-parser')
const express = require('express')

const app = express().use(bodyParser.json())

app.post('/webhook', (req, res) => {
  // Checks this is an event from a page subscription
  if (req.body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    req.body.entry.forEach(entry => {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)
    })

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED')
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
})

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.PINYIN_MESSENGER_VERIFY
  if (!VERIFY_TOKEN) {
    console.error('You have to export PINYIN_MESSENGER_VERIFY in your envirement variables')
    process.exit(1)
  }

  // Parse the query params
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
})

// let bot = new Bot({
//   token: process.env.PINYIN_MESSENGER_TOKEN,
//   verify: process.env.PINYIN_MESSENGER_VERIFY,
//   app_secret: process.env.PINYIN_MESSENGER_APP_SECRET
// })
 
// bot.on('error', (err) => {
//   console.log(err.message)
// })
 
// bot.on('message', (payload, reply) => {
//   let text = payload.message.text
//   botCore.processMessage(text, (res) => {
//   	reply({text: res})
//   })
// })
 
const port = Number(process.env.PORT || 8080)
app.listen(port, () => console.log(`Server running on port ${port}`))
