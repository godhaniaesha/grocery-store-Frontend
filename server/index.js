const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/vegi_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
  googleId: String
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Google OAuth login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { name, email, picture, googleId } = req.body;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId
      });
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});