const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешён' });
  }

  const { name, email, message } = req.body;

  // Валидация данных
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  // Telegram Bot Token и Chat ID
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Формируем сообщение
  const telegramMessage = `
    Новая заявка:
    Имя: ${name}
    Email: ${email}
    Сообщение: ${message}
  `;

  try {
    // Отправляем сообщение в Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
    });

    res.status(200).json({ message: 'Заявка отправлена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};