const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", function(req, res) {

    fs.readdir("./files", function(err, files) {

        res.render("index", {
            files,
            deleted: req.query.deleted
        });

    });

});

app.post("/create", function(req, res) {

    fs.writeFile(
        `./files/${req.body.title.split(" ").join(" ")}.txt`,
        req.body.details,
        function(err) {

            res.redirect("/");

        }
    );

});

app.get("/file/:filename", function(req, res) {

    fs.readFile(
        `./files/${req.params.filename}`,
        "utf-8",
        function(err, filedata) {

            res.render("show", {
                filename: req.params.filename,
                filedata: filedata
            });

        }
    );

});

app.delete("/file/:filename", function(req, res) {

    fs.unlink(`./files/${req.params.filename}`, function(err) {

        if (err) {
            return res.send("Error deleting file");
        }

        res.redirect("/?deleted=true");

    });

});

app.get("/user/:username", function(req, res) {

    res.send(`Hiiii ${req.params.username}`);

});

app.get("/user/:username/:age", function(req, res) {

    res.send(`Hiiii ${req.params.username} your age is ${req.params.age}`);

});

app.listen(3000, function() {

    console.log("it's running");

});