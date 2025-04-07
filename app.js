const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/BlogRoutes');
const authRoutes =require('./routes/AuthRoutes')
const app = express();
const PORT = 3000;
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: 'your_session_secret', // store in .env later
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/blogDB' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://admin:pass123@cluster0.l9elvxw.mongodb.net/blogDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB Atlas connection error:', err));


// Use blog routes
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
