const express = require('express');
const redis = require('redis');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

app.get('/api/score', async (req, res) => {
  const xWins = await client.get('x_wins') || 0;
  const oWins = await client.get('o_wins') || 0;
  res.json({ x: parseInt(xWins), o: parseInt(oWins) });
});

app.post('/api/win', async (req, res) => {
  const { winner } = req.body;
  if (winner === 'X') await client.incr('x_wins');
  if (winner === 'O') await client.incr('o_wins');
  res.json({ status: 'success' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
