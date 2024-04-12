const shortid = require("shortid");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Url = require("../model/shortUrl.js");
const User = require("../model/authModel.js");

async function handleCreateShortUrl(req, res) {
  const body = req.body;
  if (!body.redirectURL) return res.status(400).json({ error: "redirectURL is required" });

  const shortID = shortid.generate();
  await Url.create({
      shortId: shortID,
      redirectURL: body.redirectURL,
      totalClicks: [],
      email: body.email
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await Url.findOne({ shortId })

  return res.json({ totalUserClicks: result.totalClicks.length, analytics: result.totalClicks })
}

async function registerUser(req, res) {
  try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ email: email, message: 'User registered successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

async function loginUser(req, res) {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, email: email });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { handleCreateShortUrl, handleGetAnalytics, loginUser, registerUser };