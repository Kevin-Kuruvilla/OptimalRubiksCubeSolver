// /api/solve.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ["https://optimal-rubiks-cube-solver.vercel.app"],
  methods: ["POST"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello");
});

app.post('/api/solve', (req, res) => {
  const python = spawn('python', ['./server/app.py', JSON.stringify(req.body)]);

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
});

module.exports = app;
