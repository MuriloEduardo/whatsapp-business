const { PORT } = require('./env');
const express = require('express');
const app = express();

app.use(express.json());

const whatsAppBusinessRoutes = require('./routes/whatsapp-business');

app.use('/whatsapp-business', whatsAppBusinessRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});
