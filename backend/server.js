// ==========================
// server.js
// ==========================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sentiment = require('sentiment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sentiment = new Sentiment();

// ==========================
// Connect to MongoDB
// ==========================
mongoose.connect('mongodb://127.0.0.1:27017/feedbackDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));


// ==========================
// User APIs
// ==========================

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================
// Feedback Schema & APIs
// ==========================
const feedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  product: String,
  message: String,
  sentiment: String,
  timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);


// Submit Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { message, product, user_id } = req.body;

    if (!message || message.trim() === '')
      return res.status(400).json({ error: 'Message cannot be empty' });

    if (!product)
      return res.status(400).json({ error: 'Product must be selected' });

    const result = sentiment.analyze(message);
    const sentimentLabel = result.score > 0 ? "Positive" :
                           result.score < 0 ? "Negative" : "Neutral";

    const feedback = new Feedback({
      product,
      message,
      sentiment: sentimentLabel,
      user_id: user_id || null
    });

    await feedback.save();
    res.json({ sentiment: sentimentLabel });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Get Summary
app.get('/api/summary', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const summary = { Positive: 0, Negative: 0, Neutral: 0 };
    feedbacks.forEach(f => summary[f.sentiment]++);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Daily Trends
app.get('/api/trends', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const dailySummary = {};

    feedbacks.forEach(f => {
      const date = f.timestamp.toISOString().split('T')[0];
      if (!dailySummary[date])
        dailySummary[date] = { Positive: 0, Negative: 0, Neutral: 0 };

      dailySummary[date][f.sentiment]++;
    });

    res.json(dailySummary);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Get Feedback (admin or specific user)
app.get('/api/feedbacks', async (req, res) => {
  try {
    const user_id = req.query.user_id;

    let feedbacks;
    if (user_id) {
      feedbacks = await Feedback.find({ user_id }).sort({ timestamp: -1 });
    } else {
      feedbacks = await Feedback.find().sort({ timestamp: -1 });
    }

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete Feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});


// ==========================
// Start Server
// ==========================
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
