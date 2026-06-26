const express = require("express");
const app = express();

const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userModel = require("./models/user");

const PORT = 3000;
const SECRET_KEY = "secret";

// =====================================
// Middlewares
// =====================================

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// =====================================
// Authentication Middleware
// =====================================

function isLoggedIn(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {

        const data = jwt.verify(token, SECRET_KEY);

        req.user = data;

        next();

    } catch (err) {

        res.clearCookie("token");
        return res.redirect("/login");

    }

}

// =====================================
// Home
// =====================================

app.get("/", (req, res) => {

    res.render("index");

});

// =====================================
// Register User
// =====================================

app.post("/create", async (req, res) => {

    const { username, email, password, age } = req.body;

    const userExists = await userModel.findOne({ email });

    if (userExists) {
        return res.send("User already exists");
    }

    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(password, salt, async (err, hash) => {

            const createdUser = await userModel.create({

                username,
                email,
                password: hash,
                age,

            });

            const token = jwt.sign(

                {
                    id: createdUser._id,
                    email: createdUser.email,
                },

                SECRET_KEY

            );

            res.cookie("token", token);

            res.redirect("/profile");

        });

    });

});

// =====================================
// Login Page
// =====================================

app.get("/login", (req, res) => {

    res.render("login");

});

// =====================================
// Login User
// =====================================

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const existUser = await userModel.findOne({ email });

    if (!existUser) {

        return res.send("Invalid Email or Password");

    }

    bcrypt.compare(

        password,

        existUser.password,

        (err, result) => {

            if (!result) {

                return res.send("Invalid Email or Password");

            }

            const token = jwt.sign(

                {
                    id: existUser._id,
                    email: existUser.email,
                },

                SECRET_KEY

            );

            res.cookie("token", token);

            res.redirect("/profile");

        }

    );

});

// =====================================
// Profile
// =====================================

app.get("/profile", isLoggedIn, async (req, res) => {

    const user = await userModel.findById(req.user.id);

    res.render("profile", {

        user,

    });

});

// =====================================
// Logout
// =====================================

app.get("/logout", (req, res) => {

    res.clearCookie("token");

    res.redirect("/login");

});

// =====================================
// Server
// =====================================

app.listen(PORT, () => {

    console.log(`Server Started at PORT ${PORT}`);

});