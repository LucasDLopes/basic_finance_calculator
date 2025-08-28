
import express from 'express';
import cors from 'cors';
import { calcQuote } from './calc.js';
import { QuotesStore } from './quotesStore.js';

const app = express();
const port = process.env.PORT || 5175;

app.use(cors());
app.use(express.json());

const store = new QuotesStore();

app.post('/api/calc', (req, res) => {
  try {
    const result = calcQuote(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid input' });
  }
});

app.get('/api/quotes', (_req, res) => {
  res.json(store.list());
});

app.post('/api/quotes', (req, res) => {
  try {
    const { input, name } = req.body;
    const result = calcQuote(input);
    const saved = store.add({ input, result, name });
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid input' });
  }
});

app.delete('/api/quotes/:id', (req, res) => {
  const ok = store.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`xDeskPro backend listening on :${port}`);
});
