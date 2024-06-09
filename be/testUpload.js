const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Percorso del file immagine da caricare
const filePath = 'C:\\Users\\ciuff\\OneDrive\\Desktop\\Immagine 2024-06-09 173150.png'; // Sostituisci con il percorso corretto

// Caricamento dell'immagine su Cloudinary
cloudinary.uploader.upload(filePath, function(error, result) {
  if (error) {
    console.error('Errore nel caricamento:', error);
  } else {
    console.log('Risultato del caricamento:', result);
  }
});
