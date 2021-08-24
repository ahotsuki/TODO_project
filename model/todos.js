const db = require("./db");

function getAll() {
  //reads the data from the json file database
  const data = db.read();
  return data.todos.length === 0
    ? [{ id: 0, title: "No entries found." }]
    : data.todos;
}

function addTodo(input) {
  const data = db.read();

  //creates an id by incrementing the id of the last entry
  const id =
    data.todos.length === 0 ? 1 : data.todos[data.todos.length - 1].id + 1;

  const entry = { id, ...input };

  //push the newly created todo and saves it to json file
  data.todos.push(entry);
  db.write(data);

  return entry;
}

function get(id) {
  const data = db.read();

  //array filter returns an element that meets the condition
  //in this case, id is compared
  const result = data.todos.filter((item) => item.id === id);
  return result.length === 0
    ? { id: 0, title: "No data with the given id found." }
    : result;
}

function update(id, body) {
  const data = db.read();

  //finds the index in the array
  const index = data.todos.findIndex((x) => x.id === id);

  //if index exists, then updates the entry
  if (index > -1) {
    data.todos[index] = { id, ...body };
    db.write(data);
    return data.todos[index];
  }
  return { id: 0, title: "No data with the given id found." };
}

function remove(id) {
  const data = db.read();

  //finds the index in the array
  const index = data.todos.findIndex((x) => x.id === id);

  //same as the update, but this removes the element in the array
  if (index > -1) {
    const removed = data.todos.splice(index, 1);
    db.write(data);
    return removed;
  }
  return { id: 0, title: "No data with the given id found." };
}

module.exports = {
  getAll,
  addTodo,
  get,
  update,
  remove,
};
