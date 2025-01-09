const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Path to the accounts file
const accountsFilePath = path.join(__dirname, 'accounts.json');

// Read accounts data from the file
const getAccounts = () => {
  try {
    const data = fs.readFileSync(accountsFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading accounts file:', err);
    return [];
  }
};

// Save accounts data to the file
const saveAccounts = (accounts) => {
  try {
    fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2));
  } catch (err) {
    console.error('Error saving accounts file:', err);
  }
};

// Route for account creation
app.post('/create-account', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const accounts = getAccounts();
  // Check if the username already exists
  const existingAccount = accounts.find((account) => account.username === username);
  if (existingAccount) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  // Create the new account and save it
  const newAccount = { username, password };
  accounts.push(newAccount);
  saveAccounts(accounts);

  res.status(201).json({ success: true, message: 'Account created successfully!' });
});

// Route for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const accounts = getAccounts();
  const account = accounts.find((acc) => acc.username === username && acc.password === password);

  if (!account) {
    return res.status(400).json({ success: false, message: 'Invalid username or password' });
  }

  res.status(200).json({ success: true, message: 'Login successful!' });
});

// Serve static files for frontend (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
