const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");

const PORT = 3000;


app.get('/', (req, res) => {
    res.send("hello");
});

app.get('/create', async (req, res) => {
    let user = await userModel.create({
        username: "Speed",
        age: 28,
        email: "speedracer@gmail.com"
    });

    res.send(user);
});

app.get("/post/create", async (req, res) => {
    let post = await postModel.create({
        postdata: "hello guys kaise ho",
        user: "6a3e872b50f5c34163651804"
    });

    let user = await userModel.findOne({_id: "6a3e872b50f5c34163651804"});
    user.posts.push(post._id);
    await user.save();

    res.send({post, user});
})


app.listen(PORT, console.log(`Server Started at PORT: ${PORT}`));