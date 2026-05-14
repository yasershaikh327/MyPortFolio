require('dotenv').config();
const express    = require('express');
const viewerRouter = require('./viewerRoute');

const app = express();

app.use(express.json());

// Viewer tracking endpoint
app.use('/api/viewer', viewerRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});