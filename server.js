const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_ID = '7644810874062012451';
const PAT_TOKEN = 'pat_HPx4uXpyf3XQOHEavsHsFBG0zK6MQybBAZn7EDrnZEg1FDD95xmu3kcU8HuNkyP1';

app.post('/api/chat', async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  try {
    const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAT_TOKEN}`
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user: userId || 'user_' + Date.now(),
        query: message,
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.messages?.find(m => m.type === 'answer')?.content 
               || data.answer 
               || '抱歉，我没有理解，请再说一次';

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: '服务暂时不可用，请稍后重试' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
