const express = require("express");
const {handleCreateShortUrl,handleGetAnalytics, registerUser, loginUser } = require("../controllers/shortUrl.js");

const router = express.Router();

router.post('/', handleCreateShortUrl);

router.get('/analytics/:shortId', handleGetAnalytics)

module.exports = router;
