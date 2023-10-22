const express = require('express')
const pubsub = require('../utils/pubsub')
const { VERIFY_TOKEN } = require('../utils/env')
const MessageModel = require('../models/Message')
const { insert } = require('../services/mongoService')
const { sendText, processMessageWithIAViaWhatsApp, extractWaId, extractTextMessages, extractMetadataPhoneNumberId } = require('../services/whatsappBusinessService')

const router = express.Router()

router.get('/webhook', async (req, res) => {
  const { query } = req
  const challenge = query['hub.challenge']
  const verify_token = query['hub.verify_token']

  if (verify_token === VERIFY_TOKEN) {
    return res.send(challenge)
  }

  res.sendStatus(403)
})

router.post('/webhook', async (req, res) => {
  const { body } = req

  await insert(MessageModel, body)

  pubsub
    .topic('whatsapp-business-messages')
    .publish(body)

  res.sendStatus(200)
})

router.post('/send', async (req, res) => {
  const { body } = req

  try {
    const to = extractWaId(body)
    const text = extractTextMessages(body)
    const from = extractMetadataPhoneNumberId(body)

    await sendText(text, to, from)

    res.sendStatus(201)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router