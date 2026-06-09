// =======================================================
// IMPORT MODULES
// =======================================================

// Built-in File System module
const fs = require("fs");

// Built-in Operating System module
const os = require("os");


// =======================================================
// CPU INFORMATION
// =======================================================

// Returns the number of logical CPU cores available
// on your machine.

console.log("Number of CPU Cores:", os.cpus().length);


// =======================================================
// ASYNCHRONOUS (NON-BLOCKING) CODE
// =======================================================

// In asynchronous operations, Node.js does not wait
// for the task to finish. It continues executing the
// next lines of code.

// Expected Output:
// 1
// 2
// 3
// 4
// File Content

console.log("\n===== ASYNC / NON-BLOCKING =====");

console.log(1);
console.log(2);

fs.readFile("./contacts.txt", "utf-8", (err, result) => {
    if (err) {
        console.log("Error:", err);
    } else {
        console.log(result);
    }
});

console.log(3);
console.log(4);


// =======================================================
// SYNCHRONOUS (BLOCKING) CODE
// =======================================================

// In synchronous operations, Node.js waits until
// the current task is completed before moving
// to the next line.

// Expected Output:
// 1
// 2
// File Content
// 3
// 4

console.log("\n===== SYNC / BLOCKING =====");

console.log(1);
console.log(2);

const result = fs.readFileSync("./contacts.txt", "utf-8");

console.log(result);

console.log(3);
console.log(4);