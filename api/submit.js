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

      // Проверка переменных окружения
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Отсутствуют переменные окружения: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
        return res.status(500).json({ message: 'Ошибка конфигурации сервера' });
      }

      // Формируем сообщение
      const telegramMessage = `
        Новая заявка:
        Имя: ${name}
        Email: ${email}
        Сообщение: ${message}
      `;

      try {
        // Отправляем сообщение в Telegram
        const response = await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
          },
          { timeout: 5000 } // Таймаут 5 секунд
        );

        if (response.status !== 200) {
          console.error('Ошибка Telegram API:', response.data);
          return res.status(500).json({ message: 'Не удалось отправить сообщение в Telegram' });
        }

        res.status(200).json({ message: 'Заявка успешно отправлена' });
      } catch (error) {
        console.error('Ошибка в submit.js:', error.message);
        if (error.code === 'ECONNABORTED') {
          return res.status(504).json({ message: 'Таймаут запроса к Telegram' });
        }
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    };