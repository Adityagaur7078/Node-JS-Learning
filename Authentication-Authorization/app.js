const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cookieParser())

app.get("/", function( req, res ) {
    // res.cookie("work", "done");
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("sleirc", salt, function(err, hash) {
            console.log(hash);
        });

        bcrypt.compare("sleirc", "$2b$10$KhyumUv8sgcDuu3YghKAOO3sNM9LsU4Lig9KPwsd6g76CcEHiFrQ2", function(err, result) {
            console.log(result);
        })
    });

    res.send("Home install");
});



app.get("/home", function( req, res ) {
    let token = jwt.sign({email: "kiss@gmail.com"}, "secret");
    res.cookie("token", token);
    res.send("do see token in the cookie")
});

app.get("/read", function( req, res ) {
    // console.log(req.cookies.token);
    let data = jwt.verify(req.cookies.token, "secret");
    console.log(data);
    
    res.send("Read install");
});

app.listen(3000);