const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const Author = require('../models/authors');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {
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

module.exports = router;
