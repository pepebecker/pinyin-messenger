'use strict'

const botCore = require('pinyin-bot-core')
const bodyParser = require('body-parser')
const express = require('express')
const request = require('request')

const app = express().use(bodyParser.json())

const callSendAPI = (sender_psid, body) => {
  const PAGE_ACCESS_TOKEN = process.env.PINYIN_MESSENGER_TOKEN
  if (!PAGE_ACCESS_TOKEN) {
    console.error('You have to export PINYIN_MESSENGER_TOKEN in your envirement variables')
    process.exit(1)
  }
  const request_body = Object.assign({}, body, {
    "recipient": { "id": sender_psid }
  })
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (err) console.error("Failed to send message:" + err)
    else console.log('Message sent:', request_body)
  })
}

const sendTextMessage = (sender_psid, text) => {
  callSendAPI(sender_psid, { message: { text } })
}

const sendTypingIndicator = (sender_psid, on = true) => {
  callSendAPI(sender_psid, { sender_action: 'typing_' + (on ? 'on' : 'off') })
}

const handleMessage = (sender_psid, received_message) => {
  if (received_message.text) {
    sendTypingIndicator(sender_psid)
    botCore.processMessage(received_message.text)
    .then(result => {
      sendTextMessage(sender_psid, result)
    })
    .catch(err => {
      console.error(error)
      sendTypingIndicator(false)
    })
  } else {
    sendTextMessage(sender_psid, 'I can only reply to text messages at the moment')
  }
}

const handlePostback = (sender_psid, received_postback) => {

}

app.post('/webhook', (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      const webhook_event = entry.messaging[0]
      if (webhook_event.message) {
        console.log('Message received:', webhook_event.message)
        handleMessage(webhook_event.sender.id, webhook_event.message)
      } else if (webhook_event.postback) {
        console.log('Postback received:', webhook_event.postback)
        handlePostback(webhook_event.sender.id, webhook_event.postback)
      } else {
        console.log('Event received:', webhook_event)
      }
    })

    res.status(200).send('EVENT_RECEIVED')
  } else {
    res.sendStatus(404)
  }
})

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.PINYIN_MESSENGER_VERIFY
  if (!VERIFY_TOKEN) {
    console.error('You have to export PINYIN_MESSENGER_VERIFY in your envirement variables')
    process.exit(1)
  }

  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      res.sendStatus(403)
    }
  }
})
 
const port = Number(process.env.PORT || 8080)
app.listen(port, () => console.log(`Server running on port ${port}`))
