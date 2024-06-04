// routes/authors.js

const express = require('express');
const router = express.Router();
const Author = require('../models/authors');

// Rotta per ottenere la lista degli autori
router.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo autore
router.get('/authors/:id', getAuthor, (req, res) => {
  res.json(res.author);
});

// Rotta per creare un nuovo autore
router.post('/authors', async (req, res) => {
  const author = new Author({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    data_di_nascita: req.body.data_di_nascita,
    avatar: req.body.avatar
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware per ottenere un singolo autore
async function getAuthor(req, res, next) {
  let author;
  try {
    author = await Author.findById(req.params.id);
    if (author == null) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.author = author;
  next();
}

module.exports = router;
