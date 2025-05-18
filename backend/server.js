const express = require('express');
const path = require('path');
const stripe = require('stripe')('your_secret_key'); // Remplacez par votre clé secrète Stripe
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const Purchase = require('./models/Purchase');

const app = express();
const port = 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));
app.use(express.urlencoded({ extended: true }));

// Configuration des prix Stripe (à remplacer par vos propres ID de prix)
const PRICE_IDS = {
  price_basic: 'price_xxxxx',
  price_standard: 'price_yyyyy',
  price_premium: 'price_zzzzz'
};

const PRICE_AMOUNTS = {
  price_basic: 50,
  price_standard: 150,
  price_premium: 300
};

const PRICE_NAMES = {
  price_basic: 'Basic Consultation',
  price_standard: 'Standard Package',
  price_premium: 'Premium Package'
};

// Route pour créer une session de paiement
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, email, fullname } = req.body;
    
    // Vérifier si le priceId est valide
    if (!PRICE_IDS[priceId]) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[priceId],
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
      customer_email: email,
    });

    // Créer un nouvel achat dans la base de données
    const purchase = new Purchase({
      customerName: fullname,
      email: email,
      serviceName: PRICE_NAMES[priceId],
      amount: PRICE_AMOUNTS[priceId],
      stripeSessionId: session.id
    });

    await purchase.save();

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook Stripe pour mettre à jour le statut des paiements
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, 'your_webhook_secret');

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Mettre à jour le statut de l'achat
      await Purchase.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'completed' }
      );
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Route pour traiter le formulaire de contact
app.post('/contact', async (req, res) => {
  try {
    const { fullname, email, message } = req.body;
    
    // Créer un nouveau message
    const newMessage = new Message({
      fullname,
      email,
      message
    });

    // Sauvegarder le message dans la base de données
    await newMessage.save();

    // Envoyer une réponse de succès
    res.json({ 
      success: true, 
      message: 'Message enregistré avec succès!'
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Une erreur est survenue lors de l\'enregistrement du message.' 
    });
  }
});

// Routes d'administration

// Récupérer tous les messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// Supprimer un message
app.delete('/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
});

// Récupérer tous les achats
app.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('Erreur lors de la récupération des achats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des achats' });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
