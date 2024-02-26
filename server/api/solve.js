// /api/solve.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();

// Configure CORS to accept requests from your client domain and methods
app.use(cors());
app.use(express.json());

app.post('/api/solve', (req, res) => {
  const python = spawn('python', ['./app.py', JSON.stringify(req.body)]);

  let outputData = '';
  python.stdout.on('data', (data) => {
    outputData += data.toString();
  });

  python.on('close', (code) => {
    if (code === 0) {
      res.json({ solution: outputData });
    } else {
      res.status(500).send('Error executing Python script');
    }
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

module.exports = app;
