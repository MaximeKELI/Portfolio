// Initialize Stripe with your publishable key
const stripe = Stripe('your_publishable_key'); // Remplacez par votre clé publique Stripe

// Handle payment button clicks
document.querySelectorAll('.stripe-button').forEach(button => {
  button.addEventListener('click', async (e) => {
    const priceId = e.target.dataset.priceId;
    
    try {
      // Call your backend to create a Checkout Session
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  });
}); 