require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connessione al database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Database connection error:', error));

// Rotte
const authorsRouter = require('./routes/authors');
const blogPostsRouter = require('./routes/blogPost');

app.use('/authors', authorsRouter);
app.use('/blogPosts', blogPostsRouter);

// Servire i file statici del frontend
app.use(express.static(path.join(__dirname, '../fe/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fe/build', 'index.html'));
});

// Avviare il server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
