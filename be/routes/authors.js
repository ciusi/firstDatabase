const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Author = require('../models/authors');

// Middleware per verificare l'ObjectId
function checkObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  next();
}

// Rotta per ottenere la lista degli autori
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo autore
router.get('/:id', checkObjectId, getAuthor, (req, res) => {
  res.json(res.author);
});

// Rotta per creare un nuovo autore
router.post('/', async (req, res) => {
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

// Rotta per modificare un autore
router.put('/:id', checkObjectId, getAuthor, async (req, res) => {
  if (req.body.nome != null) {
    res.author.nome = req.body.nome;
  }
  if (req.body.cognome != null) {
    res.author.cognome = req.body.cognome;
  }
  if (req.body.email != null) {
    res.author.email = req.body.email;
  }
  if (req.body.data_di_nascita != null) {
    res.author.data_di_nascita = req.body.data_di_nascita;
  }
  if (req.body.avatar != null) {
    res.author.avatar = req.body.avatar;
  }

  try {
    const updatedAuthor = await res.author.save();
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per cancellare un autore
router.delete('/:id', checkObjectId, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author == null) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
    await Author.deleteOne({ _id: req.params.id });
    res.json({ message: 'Autore cancellato' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
