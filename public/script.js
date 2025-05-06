document.getElementById('request-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const formMessage = document.getElementById('form-message');
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      if (response.ok) {
        formMessage.textContent = 'Заявка успешно отправлена!';
        document.getElementById('request-form').reset();
      } else {
        formMessage.textContent = 'Ошибка при отправке заявки.';
      }
    } catch (error) {
      formMessage.textContent = 'Ошибка сети. Попробуйте позже.';
    }
  });