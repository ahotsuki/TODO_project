require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const model = require("./model/todos");

//Middlewares
app.use(express.static(path.join(__dirname, "ui")));
app.use(express.json());

//
//Routes for todos
//

app.get("/api/todos", (req, res) => {
  res.send(model.getAll());
});

app.post("/api/todos", (req, res) => {
  const result = model.addTodo(req.body);
  res.send(result);
});

app.get("/api/todos/:id", (req, res) => {
  const result = model.get(parseInt(req.params.id));
  res.send(result);
});

app.put("/api/todos/:id", (req, res) => {
  const result = model.update(parseInt(req.params.id), req.body);
  res.send(result);
});

app.delete("/api/todos/:id", (req, res) => {
  const result = model.remove(parseInt(req.params.id));
  res.send(result);
});

//Home route for the UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ui", "index.html"));
});

//Server start
const PORT = process.env.TODO_PORT;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
