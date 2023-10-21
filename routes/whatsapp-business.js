const express = require('express');
const router = express.Router();
const { VERIFY_TOKEN } = require('../env');
const MessageModel = require('../models/Message');

router.get('/webhook/verify', async (req, res) => {
  const { query } = req;
  const challenge = query['hub.challenge']
  const verify_token = query['hub.verify_token']

  if (verify_token === VERIFY_TOKEN) {
    return res.send(challenge);
  }

  res.sendStatus(403);
});

router.post('/webhook', async (req, res) => {
  const { body } = req;

  await insert(MessageModel, body);

  res.sendStatus(200);
});

module.exports = router;