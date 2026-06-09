// Import the built-in File System module
// It allows Node.js to create, read, update, delete files and folders.
const fs = require("fs");


// =======================================================
// 1. WRITE FILE (Synchronous)
// =======================================================

// Creates a new file or overwrites an existing file.
// Execution stops until the file is written.

fs.writeFileSync(
    "./test.js",
    "Hello! This file was created using writeFileSync()."
);


// =======================================================
// 2. WRITE FILE (Asynchronous)
// =======================================================

// Creates or overwrites a file.
// Does NOT block the execution of the program.

fs.writeFile(
    "./test.js",
    "Hello! This file was created using writeFile().",
    (err) => {
        if (err) {
            console.log("Error writing file:", err);
        } else {
            console.log("File written successfully!");
        }
    }
);


// =======================================================
// 3. READ FILE (Synchronous)
// =======================================================

// Reads file content and returns it immediately.
// Program waits until reading is complete.

const result = fs.readFileSync("./contacts.txt", "utf-8");
console.log(result);


// =======================================================
// 4. READ FILE (Asynchronous)
// =======================================================

// Reads file without blocking the program.

fs.readFile("./contacts.txt", "utf-8", (err, result) => {
    if (err) {
        console.log("Error reading file:", err);
    } else {
        console.log(result);
    }
});


// =======================================================
// 5. APPEND DATA TO FILE
// =======================================================

// Adds new content at the end of an existing file.
// Creates the file if it doesn't exist.

fs.appendFileSync(
    "./test.txt",
    `${Date.now()} - Hey There\n`
);


// =======================================================
// 6. COPY FILE
// =======================================================

// Creates a copy of test.txt named copy.txt

fs.cpSync("./test.txt", "./copy.txt");


// =======================================================
// 7. DELETE FILE
// =======================================================

// Deletes the specified file permanently.

fs.unlinkSync("./copy.txt");


// =======================================================
// 8. FILE INFORMATION (STAT)
// =======================================================

// Returns information about the file.

console.log(fs.statSync("./test.txt"));


// Check whether the path points to a file

console.log(fs.statSync("./test.txt").isFile());


// =======================================================
// 9. CREATE FOLDERS
// =======================================================

// Creates nested folders automatically.
// recursive: true means create missing parent folders too.

fs.mkdirSync("my-docs/a/b", {
    recursive: true,
});