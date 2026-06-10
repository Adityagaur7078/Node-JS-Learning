const express = require("express")

const app = express()

app.get("/", (req, res) => {
    return res.send("Hey Welcome to Home Page")
})

app.get("/about", (req, res) => {
    return res.send(`Hey Welcome ${req.query.name}`)
})

app.listen(5173, () => console.log("Server Started"))
