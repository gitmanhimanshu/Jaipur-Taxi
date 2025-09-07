// Simple CORS test endpoint
const express = require('express');
const cors = require('cors');

const app = express();

// Allow all origins for testing
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.get('/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working! ✅',
    origin: req.headers.origin || 'No origin',
    timestamp: new Date().toISOString()
  });
});

app.post('/test-cors', (req, res) => {
  res.json({
    message: 'POST request successful! ✅',
    data: req.body,
    origin: req.headers.origin || 'No origin',
    timestamp: new Date().toISOString()
  });
});

if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`🧪 CORS Test Server running on http://localhost:${PORT}`);
    console.log(`Test endpoints:`);
    console.log(`  GET  http://localhost:${PORT}/test-cors`);
    console.log(`  POST http://localhost:${PORT}/test-cors`);
  });
}

module.exports = app;
