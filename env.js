require('dotenv').config()

exports.PORT = process.env.PORT
exports.TOKEN = process.env.TOKEN;
exports.MONGO_URL = process.env.MONGO_URL
exports.API_VERSION = process.env.API_VERSION;
exports.VERIFY_TOKEN = process.env.VERIFY_TOKEN
exports.OPENAI_API_URL = process.env.OPENAI_API_URL