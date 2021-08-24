require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const todosRouter = require("./routes/todos");

app.use(express.static(path.join(__dirname, "ui")));
app.use(express.json());
app.use("/api/todos", todosRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ui", "index.html"));
});

const PORT = process.env.TODO_PORT;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
