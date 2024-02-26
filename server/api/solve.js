// /api/solve.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();

// Configure CORS to accept requests from your client domain and methods
app.use(cors({
  origin: "https://optimal-rubiks-cube-solver.vercel.app",
  methods: ["POST", "OPTIONS"], // Ensure OPTIONS is included
  allowedHeaders: ["Content-Type"] // You can specify headers
}));

// Enable pre-flight request for POST request
app.options('/api/solve', cors()); // Enable CORS for pre-flight

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

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

module.exports = app;
