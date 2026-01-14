const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { connectToDatabase } = require('./config/db');

// Always load .env from backend root regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: false,
  })
);
app.use(morgan('dev'));

// Routes
app.use('/api/staff', require('./routes/staff'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/auth', require('./routes/auth'));

// Health
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Prefer .env; fallback to local dev only
    await connectToDatabase(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wsmgmt'
    );
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


