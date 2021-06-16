const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found." });
  }

  request.user = user;

  next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const user = users.find((user) => user.username === username);

  if (user) {
    return response.status(400).json({ error: "User is already exists." });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  const { title, deadline } = request.body;

  const indexTODO = user.todos.findIndex((todo) => todo.id === id);

  if (indexTODO === -1) {
    return response.status(404).json({ error: "TODO not found" });
  }

  user.todos[indexTODO] = { ...user.todos[indexTODO], title, deadline };
  return response.status(200).json(user.todos[indexTODO]);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const indexTODO = user.todos.findIndex((todo) => todo.id === id);

  if (indexTODO === -1) {
    return response.status(404).json({ error: "TODO not found" });
  }

  user.todos[indexTODO] = { ...user.todos[indexTODO], done: true };
  return response.status(200).json(user.todos[indexTODO]);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const indexTODO = user.todos.findIndex((todo) => todo.id === id);

  if (indexTODO === -1) {
    return response.status(404).json({ error: "TODO not found" });
  }

  user.todos.splice(indexTODO, 1);

  return response.status(204).send();
});

module.exports = app;
