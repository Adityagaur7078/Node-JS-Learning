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
app.get('/profile', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email }).populate("posts")
    res.render('profile', { user });
});

// Like Route

app.get('/like/:id', isLoggedIn, async (req, res) => {
    const post = await postModel.findOne({ _id: req.params.id }).populate("user");

    const liked = post.likes.findIndex(id => id.equals(req.user.userid));

    if (liked === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(liked, 1);
    }


    await post.save();
    res.redirect('/profile');
});

app.post('/createPost', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;
    let post = await postModel.create({
        user: user._id,
        content: content
    });

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
});

// Edit Post Route

app.get("/edit/:id", isLoggedIn, async (req, res) => {

    const post = await postModel.findById(req.params.id);

    if (!post.user.equals(req.user.userid)) {
        return res.status(403).send("Unauthorized");
    }

    res.render("edit", { post });
});

app.post("/edit/:id", isLoggedIn, async (req, res) => {

    const post = await postModel.findById(req.params.id);

    if (!post.user.equals(req.user.userid)) {
        return res.status(403).send("Unauthorized");
    }

    post.content = req.body.content;
    await post.save();

    res.redirect("/profile");
});


// ======================================================
// POST ROUTES
// ======================================================

// User Registration
app.post('/register', async (req, res) => {

    let { name, email, username, age, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(409).redirect("/login");

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
                {
                    email: createdUser.email,
                    userid: createdUser._id
                },
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
                { email: email, userid: user._id },
                "secret"
            );

            res.cookie("token", token);

            res.status(200).redirect("/profile");

        } else {

            res.redirect("/login");

        }

    });

});


// User Logout
app.get('/logout', (req, res) => {

    res.clearCookie("token");
    res.redirect("/login");

});


// ======================================================
// CUSTOM MIDDLEWARES
// ======================================================

// Authentication Middleware
function isLoggedIn(req, res, next) {

    if (!req.cookies.token) {
        return res.redirect("/login");
    }

    try {
        let data = jwt.verify(req.cookies.token, "secret");
        req.user = data;
        next();
    } catch (err) {
        return res.redirect("/login");
    }
}


// ======================================================
// SERVER
// ======================================================

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
});