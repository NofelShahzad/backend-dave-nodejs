// console.log(global)

// 1- Node runs on server not on browser (backend not frontend)
// 2- The console is the terminal window
// 3- global object instead of window object
// 4- Common JS modules insted of ES6 modules(import abc from 'abc')
// 5- Missing some JS APIs like fetch

const os = require('os');
const path = require('path');
const {add, multiply, subtract, divide} = require('./math')



// console.log(os.type());
// console.log(os.version());
// console.log(os.homedir());

// console.log("==================");
// console.log(__dirname);
// console.log(__filename);
// console.log("==================");

// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));

// console.log("==================");

// console.log(path.parse(__filename));

console.log(add(3,4))
console.log(subtract(3,4))
console.log(multiply(3,4))
console.log(divide(3,4))

