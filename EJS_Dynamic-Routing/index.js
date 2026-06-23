const express = require("express");
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", function( req, res ) {
    res.render("index")
});

app.get("/user/:username", function( req, res ) {
    res.send(`Hiiii ${req.params.username}`)
});

app.get("/user/:username/:age", function( req, res ) {
    res.send(`Hiiii ${req.params.username} your age is ${req.params.age}`)
});

app.listen(3000, function() {
    console.log("it's running")
});