// models/author.js

const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cognome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  data_di_nascita: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
});

module.exports = mongoose.model('Author', authorSchema);
