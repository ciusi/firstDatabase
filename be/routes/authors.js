const express = require('express');
const router = express.Router();
const Author = require('../models/authors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
const authMiddleware = require('../middleware/authMiddleware');

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurazione di multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    format: async (req, file) => 'jpg', // Formato immagine
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({ storage: storage });

// Rotta per ottenere la lista degli autori con paginazione
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await Author.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = await Author.find().limit(limit).skip(startIndex).exec();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo autore
router.get('/:id', authMiddleware, getAuthor, (req, res) => {
  res.json(res.author);
});

// Rotta per creare un nuovo autore
router.post('/', authMiddleware, async (req, res) => {
  const author = new Author({
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    data_di_nascita: req.body.data_di_nascita,
    avatar: req.body.avatar
  });

  try {
    const newAuthor = await author.save();

    // Invia email di benvenuto
    const msg = {
      to: newAuthor.email,
      from: 'ciuffetellisilvia@com', // indirizzo email verificato su SendGrid (rivedere)
      subject: 'Benvenuto su Strive Blog!',
      text: `Ciao ${newAuthor.nome}, benvenuto su Strive Blog!`,
    };

    await sgMail.send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error('Error sending email:', error.response.body);
      });

    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per modificare un autore
router.put('/:id', authMiddleware, getAuthor, async (req, res) => {
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
router.delete('/:id', authMiddleware, getAuthor, async (req, res) => {
  try {
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

// Rotta per caricare un'immagine per l'autore specificato
router.patch('/:id/avatar', authMiddleware, parser.single('avatar'), async (req, res) => {
  console.log('Richiesta PATCH /:id/avatar ricevuta'); // Log inizio richiesta

  try {
    if (!req.file) {
      console.log('Nessun file caricato'); // Log mancanza file
      return res.status(400).json({ message: 'Nessun file caricato' });
    }

    console.log('File caricato:', req.file); // Log dettagli file caricato

    const author = await Author.findById(req.params.id);
    if (!author) {
      console.log('Autore non trovato'); // Log autore non trovato
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    author.avatar = req.file.path;
    await author.save();
    console.log('Avatar aggiornato con successo'); // Log successo
    res.json(author);
  } catch (err) {
    console.error('Errore nel caricamento dell\'avatar:', err); // Log errore dettagliato
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
