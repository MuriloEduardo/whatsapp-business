const { PORT } = require('./env');
const express = require('express');
const app = express();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});
