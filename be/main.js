require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connessione a MongoDB utilizzando le variabili d'ambiente
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Database connected'))
  .catch(err => console.error('Error connecting to Database:', err));

// Middleware
app.use(express.json());

const blogPostsRouter = require('./routes/blogPost');
app.use('/blogPosts', blogPostsRouter);

const cors = require('cors');
app.use(cors());


// Importa le rotte degli autori
const authorsRouter = require('./routes/authors');

// Utilizza le rotte degli autori
app.use('/authors', authorsRouter);

// Configurazione della porta
const PORT = process.env.PORT || 4000;

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
