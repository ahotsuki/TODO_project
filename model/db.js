const path = require("path");
const fs = require("fs");
const dbFile = process.env.TODO_DATABASE;
const filePath = path.join(__dirname, "..", dbFile);

//Create a db file based in the .env configs if db file does not exist
if (!fs.existsSync(filePath)) {
  try {
    console.log("No database found. Creating database.");
    const defaults = { todos: [] };
    write(defaults);
  } catch (ex) {
    console.error("Error in creating database.");
    process.exit(1);
  }
}

//Reads the json file and returns a javascript object
function read() {
  try {
    const jsonString = fs.readFileSync(filePath);
    return JSON.parse(jsonString);
  } catch (ex) {
    console.error(ex);
    return "Database error.";
  }
}

//save the resulting javascript object to json file
function write(input) {
  try {
    const data = JSON.stringify(input);
    fs.writeFileSync(filePath, data);
  } catch (ex) {
    console.error(ex);
    return "Database error.";
  }
}

module.exports = {
  read,
  write,
};
