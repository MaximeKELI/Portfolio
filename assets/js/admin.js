// Configuration
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // À changer pour un mot de passe plus sécurisé en production

// Éléments du DOM
const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('loginContainer');
const adminContainer = document.getElementById('adminContainer');
const loginError = document.getElementById('loginError');
const messagesTableBody = document.getElementById('messagesTableBody');
const purchasesTableBody = document.getElementById('purchasesTableBody');

// Gestion de l'authentification
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        loadData();
    } else {
        loginError.textContent = 'Identifiants incorrects';
        loginError.style.display = 'block';
    }
});

// Gestion des onglets
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Retirer la classe active de tous les boutons et contenus
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Ajouter la classe active au bouton cliqué
        button.classList.add('active');
        
        // Afficher le contenu correspondant
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

// Charger les données
async function loadData() {
    try {
        // Charger les messages
        const messagesResponse = await fetch('/messages');
        const messages = await messagesResponse.json();
        displayMessages(messages);

        // Charger les achats
        const purchasesResponse = await fetch('/purchases');
        const purchases = await purchasesResponse.json();
        displayPurchases(purchases);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Afficher les messages
function displayMessages(messages) {
    messagesTableBody.innerHTML = messages.map(message => `
        <tr>
            <td>${new Date(message.createdAt).toLocaleString()}</td>
            <td>${message.fullname}</td>
            <td>${message.email}</td>
            <td>${message.message}</td>
            <td>
                <button class="delete-btn" onclick="deleteMessage('${message._id}')">
                    Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

// Afficher les achats
function displayPurchases(purchases) {
    purchasesTableBody.innerHTML = purchases.map(purchase => `
        <tr>
            <td>${new Date(purchase.createdAt).toLocaleString()}</td>
            <td>${purchase.customerName}</td>
            <td>${purchase.serviceName}</td>
            <td>${purchase.amount}€</td>
            <td>${purchase.status}</td>
        </tr>
    `).join('');
}

// Supprimer un message
async function deleteMessage(messageId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
        try {
            const response = await fetch(`/messages/${messageId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Recharger les messages
                const messagesResponse = await fetch('/messages');
                const messages = await messagesResponse.json();
                displayMessages(messages);
            } else {
                alert('Erreur lors de la suppression du message');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du message');
        }
    }
}

// Rafraîchir les données toutes les 30 secondes
setInterval(loadData, 30000); 