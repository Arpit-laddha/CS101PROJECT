const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bankSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User schema with balance and transactions
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  balance: {
      type: Number,
      default: 0
  },
  transactions: [
      {
          type: String, // 'deposit' or 'withdrawal'
          amount: Number,
          date: {
              type: Date,
              default: Date.now
          }
      }
  ]
}), 'user'); // 👈 This forces it to use the 'user' collection


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Routes
app.get('/login', (req, res) => {
  res.render('login'); // assuming you have views/login.ejs
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.render('dashboard', { user });
    } else {
      res.redirect('/login');
    }
});

app.get('/transactions', async (req, res) => {
    if (!req.session.user) return res.redirect('/');
    const user = await User.findById(req.session.user._id);
    res.render('transaction', {
        username: user.username,
        transactions: user.transactions || []
    });
});

app.get('/dashboard', async (req, res) => {
  const user = await User.findOne({ username: req.session.username });
  
  if (!user) {
      return res.redirect('/login');
  }

  res.render('dashboard', {
      user,
      transactions: User.transactions || [] // Make sure this is defined
  });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/transactions/:username', async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).send("User not found");

  let transactions = user.transactions;

  // Fallback for no transactions
  if (!transactions || transactions.length === 0) {
    transactions = [{
      title: "No Transactions",
      desc: "No transaction history available.",
      date: new Date(),
      type: "credit", // just to avoid styling issues
      amount: 0
    }];
  }

  res.render('history', {
    username,
    transactions
  });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
