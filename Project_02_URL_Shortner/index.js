const express = require('express');
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url')
const urlRoute = require('./routes/url');

const app = express();
const PORT = 3000;

connectToMongoDB('mongodb://localhost:27017/short-url').then( () => console.log("MongoDB Connected"))

app.use(express.json());

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        }
    )
    res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log(`Server Stated at PORT ${PORT}`))