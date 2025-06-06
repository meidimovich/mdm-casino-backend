
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

let users = {}; // Баланс по Telegram ID
let PROMO_CODE = 'mdm2025';
let PROMO_BONUS = 500;

app.post('/api/spin', (req, res) => {
  const { id } = req.body;
  if (!users[id]) users[id] = 1000;
  users[id] -= 10; // ставка
  const win = Math.random() > 0.7 ? 100 : 0;
  users[id] += win;
  res.json({ win, balance: users[id] });
});

app.post('/api/promo', (req, res) => {
  const { id, code } = req.body;
  if (code === PROMO_CODE && !users[id + '_promo']) {
    users[id] = (users[id] || 0) + PROMO_BONUS;
    users[id + '_promo'] = true;
    return res.json({ success: true, balance: users[id] });
  }
  return res.json({ success: false, balance: users[id] || 0 });
});

app.get('/', (req, res) => {
  res.send('MDM Server is running.');
});

app.listen(3000, () => console.log('Server on port 3000'));
