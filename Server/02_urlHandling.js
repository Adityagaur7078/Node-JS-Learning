// =======================================================
// IMPORT REQUIRED MODULES
// =======================================================

// Built-in HTTP module
// Used to create a web server.
const http = require("http");

// Built-in File System module
// Used to read, write and append files.
const fs = require("fs");

// Used to parse URL paths and query parameters.
const url = require("url");


// =======================================================
// CREATE HTTP SERVER
// =======================================================

const myServer = http.createServer((req, res) => {

    // Ignore browser favicon requests.
    // Otherwise every page refresh creates an extra request.
    if (req.url === "/favicon.ico") {
        return res.end();
    }

    // ===================================================
    // CREATE A LOG ENTRY
    // ===================================================

    // Example:
    // 1749550000000 User Enter at that time in the /about

    const log = `${Date.now()} User Enter at that time in the ${req.url}\n`;

    // Parse the URL.
    // true converts query string into an object.
    //
    // Example:
    // /about?myname=Aditya
    //
    // pathname => "/about"
    // query => { myname: "Aditya" }

    const myUrl = url.parse(req.url, true);


    // ===================================================
    // SAVE LOG INTO FILE
    // ===================================================

    fs.appendFile("./text.js", log, (err) => {

        if (err) {
            return res.end("Something went wrong while logging.");
        }

        // ===============================================
        // ROUTE HANDLING
        // ===============================================

        switch (myUrl.pathname) {

            // Home Page
            case "/":
                res.end("Hello! Welcome to Homepage!");
                break;


            // Contact Page
            case "/contact-us":
                res.end("Aditya: +91 9876543210");
                break;


            // About Page
            // Example:
            // /about?myname=Aditya

            case "/about":

                const username = myUrl.query.myname;

                res.end(`I know you are ${username}`);

                break;


            // Search Page
            // Example:
            // /search?search_query=nodejs

            case "/search":

                const search = myUrl.query.search_query;

                res.end(`Here are your search results for ${search}`);

                break;


            // Unknown Route

            default:
                res.end("404 - Page Not Found");
        }
    });
});


// =======================================================
// START SERVER
// =======================================================

// Server will run on:
// http://localhost:5173

myServer.listen(5173, () => {
    console.log("Server Started!");
});
