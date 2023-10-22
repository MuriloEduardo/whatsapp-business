const { PubSub } = require('@google-cloud/pubsub');

let pubsub

if (!pubsub) pubsub = new PubSub()

module.exports = pubsub