const express = require('express');
const router = express.Router();
const Author = require('../models/authors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Registrazione
router.post('/register', async (req, res) => {
  // codice di registrazione
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(400).json({ message: 'Email o password errati' });
    }

    const isMatch = await bcrypt.compare(password, author.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email o password errati' });
    }

    const token = jwt.sign({ id: author._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Richiesta reset password
router.post('/forgot-password', async (req, res) => {
  // codice di richiesta reset password
});

// Reset della password
router.post('/reset-password/:token', async (req, res) => {
  // codice di reset della password
});

module.exports = router;
