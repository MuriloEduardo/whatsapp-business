const express = require('express')
const { PORT } = require('./utils/env')

const app = express()

app.use(express.json())

const whatsAppBusinessRoutes = require('./routes/whatsapp-business')

app.use('/whatsapp-business', whatsAppBusinessRoutes)

app.listen(PORT, () => console.log(`Running in ${PORT}`))
