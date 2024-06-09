const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const Author = require('../models/authors');
const sgMail = require('@sendgrid/mail');
const authMiddleware = require('../middleware/authMiddleware');  // Importato middleware di autenticazione

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Rotta per ottenere la lista dei blog post
router.get('/', authMiddleware, async (req, res) => {  // Usa middleware di autenticazione
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo blog post
router.get('/:id', authMiddleware, async (req, res) => {  // Usa middleware di autenticazione
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per creare un nuovo blog post
router.post('/', authMiddleware, async (req, res) => {  // Uso  middleware di autenticazione
  console.log('Dati ricevuti:', req.body); // Log dei dati ricevuti
  const blogPost = new BlogPost(req.body);

  try {
    const newBlogPost = await blogPost.save();

    // Invia email all'autore
    const author = await Author.findOne({ email: blogPost.author });
    if (author) {
      const msg = {
        to: author.email,
        from: 'ciuffetellisilvia@gmail.com',
        subject: 'Nuovo blog post pubblicato',
        text: `Ciao ${author.nome}, hai pubblicato un nuovo blog post!`,
        html: `<strong>Ciao ${author.nome}, hai pubblicato un nuovo blog post!</strong>`,
      };

      await sgMail.send(msg);
      console.log('Email inviata all\'autore'); // Log email inviata
    }

    res.status(201).json(newBlogPost);
  } catch (err) {
    console.error('Errore nella creazione del blog post o nell\'invio dell\'email:', err);
    res.status(400).json({ message: err.message });
  }
});

// Rotta per modificare un blog post
router.put('/:id', authMiddleware, async (req, res) => {  // Uso middleware di autenticazione
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    Object.assign(blogPost, req.body);
    await blogPost.save();
    res.json(blogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per cancellare un blog post
router.delete('/:id', authMiddleware, async (req, res) => {  // Uso middleware di autenticazione
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    await blogPost.remove();
    res.json({ message: 'Blog post cancellato' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
