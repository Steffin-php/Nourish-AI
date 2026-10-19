import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleAiStatus, handleExtractLabelImage, handleExplainLabel } from './src/server/apiHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// API endpoints
app.get('/api/ai-status', handleAiStatus);
app.post('/api/extract-label-image', handleExtractLabelImage);
app.post('/api/explain-label', handleExplainLabel);

// Serve built frontend assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Nourish AI server running on port ${port}`);
});
