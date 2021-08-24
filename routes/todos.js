const express = require("express");
const router = express.Router();
const model = require("../model/todos");

router.get("/", (req, res) => {
  res.send(model.getAll());
});

router.post("/", (req, res) => {
  const result = model.addTodo(req.body);
  res.send(result);
});

router.get("/:id", (req, res) => {
  const result = model.get(parseInt(req.params.id));
  res.send(result);
});

router.put("/:id", (req, res) => {
  const result = model.update(parseInt(req.params.id), req.body);
  res.send(result);
});

router.delete("/:id", (req, res) => {
  const result = model.remove(parseInt(req.params.id));
  res.send(result);
});

module.exports = router;
