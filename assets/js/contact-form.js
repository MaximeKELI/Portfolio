// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('[data-form]');
  const formBtn = document.querySelector('[data-form-btn]');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Récupérer les données du formulaire
      const formData = {
        fullname: contactForm.querySelector('[name="fullname"]').value,
        email: contactForm.querySelector('[name="email"]').value,
        message: contactForm.querySelector('[name="message"]').value
      };

      try {
        // Envoyer les données au serveur
        const response = await fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
          // Afficher un message de succès
          alert('Message envoyé avec succès!');
          // Réinitialiser le formulaire
          contactForm.reset();
          // Désactiver le bouton d'envoi
          formBtn.disabled = true;
        } else {
          throw new Error(data.message || 'Une erreur est survenue');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert(error.message || 'Une erreur est survenue lors de l\'envoi du message');
      }
    });

    // Activer le bouton d'envoi lorsque tous les champs sont remplis
    const formInputs = contactForm.querySelectorAll('[data-form-input]');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
        formBtn.disabled = !allFilled;
      });
    });
  }
}); 