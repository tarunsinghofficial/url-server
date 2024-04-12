const express = require("express");
const connectDB = require("./db/index.js");
const dotenv = require("dotenv");
const cors = require("cors")
const UrlRoute = require("../server/routes/shortUrl.js");
const authRoutes = require('../server/routes/authRoute.js');

const URL = require('./model/shortUrl.js')

dotenv.config();

const app = express();
connectDB();

const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, PUT, HEAD, DELETE, PATCH"
}))

app.use(express.json())

app.use('/api/auth', authRoutes);

app.use("/api/url", UrlRoute);

app.get("/api/urls", async (req, res) => {
    try {
        const shortenedUrls = await URL.find();
        res.json(shortenedUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate({
            shortId
        }, {
            $push: {
                totalClicks: {
                    timestamp: Date.now()
                }
            }
        });
        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(PORT, () => (
    console.log(`Server is running at ${PORT}`)
));
