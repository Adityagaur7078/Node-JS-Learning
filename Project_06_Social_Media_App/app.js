// ======================================================
// IMPORTS
// ======================================================

const express = require('express');
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post");

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// ======================================================
// MIDDLEWARES
// ======================================================

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ======================================================
// PORT CONFIGURATION
// ======================================================

const PORT = 3000;


// ======================================================
// GET ROUTES
// ======================================================

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Profile Page (Protected Route)
app.get('/profile', isLoggedIn, (req, res) => {
    res.render('login');
});


// ======================================================
// POST ROUTES
// ======================================================

// User Registration
app.post('/register', async (req, res) => {

    let { name, email, username, age, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(500).send("User already registered");

    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(password, salt, async (err, hash) => {

            let createdUser = await userModel.create({
                username,
                email,
                age,
                name,
                password: hash
            });

            let token = jwt.sign(
                { email: email, userid: user._id },
                "secret"
            );

            res.cookie("token", token);

            res.send("registered");
        });

    });

});


// User Login
app.post('/login', async (req, res) => {

    let { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) return res.status(500).send("Something went wrong!");

    bcrypt.compare(password, user.password, (err, result) => {

        if (result) {

            let token = jwt.sign(
                { email: email, usedid: user._id },
                "secret"
            );

            res.cookie("token", token);

            res.status(200).send("you can login");

        } else {

            res.redirect("/login");

        }

    });

});


// User Logout
app.get('/logout', (req, res) => {

    res.cookie("token", "");

    res.redirect('/login');

});


// ======================================================
// CUSTOM MIDDLEWARES
// ======================================================

// Authentication Middleware
function isLoggedIn(req, res, next) {

    if (req.cookies.token === "") {

        res.send("You must be logged in");

    } else {

        let data = jwt.verify(req.cookie.token, "secret");

        req.user = data;

        next();

    }

}


// ======================================================
// SERVER
// ======================================================

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
});