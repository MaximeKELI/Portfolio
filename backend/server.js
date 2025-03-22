const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Pour servir des fichiers statiques comme des images, CSS, JS
app.use(express.static(path.join(__dirname, 'assets')));

// Pour parser le body des requêtes POST (formulaire)
app.use(express.urlencoded({ extended: true }));

// Route pour traiter le formulaire de contact
app.post('/contact', (req, res) => {
  const { fullname, email, message } = req.body;
  console.log('Nom:', fullname);
  console.log('Email:', email);
  console.log('Message:', message);

  // Enregistrez les informations dans une base de données ici si nécessaire

  res.send('Merci pour votre message!');
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
