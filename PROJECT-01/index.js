const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 5174;

// =======================================================
// Built-in Middleware
// =======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =======================================================
// Custom Middleware
// =======================================================

app.use((req, res, next) => {

    console.log("\n===== REQUEST RECEIVED =====");
    console.log("Method:", req.method);
    console.log("Path:", req.path);

    // Read Request Header
    console.log("User-Agent:", req.headers["user-agent"]);

    // Add custom property to req object
    req.requestTime = Date.now();
    req.myName = "Aditya";

    // Set custom response header
    res.setHeader("X-Powered-By", "Aditya");

    // Log request into file
    const log = `${new Date().toISOString()} | ${req.method} | ${req.path}\n`;

    fs.appendFile("./log.txt", log, (err) => {
        if (err) {
            console.log("Logging Error:", err);
        }

        next();
    });

});

// =======================================================
// HTML Route
// =======================================================

app.get("/users", (req, res) => {

    const html = `
    <h1>User List</h1>
    <p>Request Time: ${req.requestTime}</p>

    <ul>
        ${users
            .map(
                (user) =>
                    `<li>${user.first_name} ${user.last_name}</li>`
            )
            .join("")}
    </ul>
    `;

    res.send(html);
});

// =======================================================
// REST API - GET ALL USERS
// =======================================================

app.route("/api/users")

    .get((req, res) => {

        console.log("Custom Property:", req.myName);

        return res.json(users);
    })

    // ===================================================
    // CREATE USER
    // ===================================================

    .post((req, res) => {

        const body = req.body;

        const newUser = {
            id: users.length
                ? users[users.length - 1].id + 1
                : 1,
            ...body,
        };

        users.push(newUser);

        fs.writeFile(
            "./MOCK_DATA.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to save user",
                    });
                }

                return res.status(201).json({
                    status: "success",
                    data: newUser,
                });
            }
        );
    });

// =======================================================
// GET USER BY ID
// =======================================================

app.route("/api/users/:id")

    .get((req, res) => {

        const id = Number(req.params.id);

        const user = users.find(
            (user) => user.id === id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json(user);
    })

    // ===================================================
    // UPDATE USER
    // ===================================================

    .patch((req, res) => {

        const id = Number(req.params.id);

        const userIndex = users.findIndex(
            (user) => user.id === id
        );

        if (userIndex === -1) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        users[userIndex] = {
            ...users[userIndex],
            ...req.body,
        };

        fs.writeFile(
            "./MOCK_DATA.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to update user",
                    });
                }

                return res.json({
                    status: "success",
                    data: users[userIndex],
                });
            }
        );
    })

    // ===================================================
    // DELETE USER
    // ===================================================

    .delete((req, res) => {

        const id = Number(req.params.id);

        const userIndex = users.findIndex(
            (user) => user.id === id
        );

        if (userIndex === -1) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const deletedUser = users.splice(
            userIndex,
            1
        );

        fs.writeFile(
            "./MOCK_DATA.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to delete user",
                    });
                }

                return res.json({
                    status: "success",
                    data: deletedUser[0],
                });
            }
        );
    });

// =======================================================
// START SERVER
// =======================================================

app.listen(PORT, () => {
    console.log(
        `Server started at Port ${PORT}`
    );
});