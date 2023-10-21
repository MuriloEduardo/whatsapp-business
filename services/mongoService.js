const mongoose = require('mongoose');
const { MONGO_URL } = require('../env');

(async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
})();

const insert = async (model, data) => {
  const newDoc = new model(data);
  return await newDoc.save();
};

const find = async (model) => {
  return await model.find().exec();
};

module.exports = { insert, find };
