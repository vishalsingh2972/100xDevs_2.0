const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3001;
const todos = require("./todos.json");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  if (!todos) {
    res.send("No todos found");
  } else {
    res.send(`
  <html>
  <head>
    <title>Todo App</title>
  </head>
  <body>
  <h1>Todo App</h1>
        <ul>
            ${todos
              .map(
                (todo) =>
                  `<li>${todo.title}  
                <form method="DELETE" action=/todos/${todo.id}>
                    <input type="submit" value="Delete" />
                </form>
                </li>`
              )
              .join("")}
        </ul>
        <form method="POST" action="/todos">
            <input type="text" name="title" />
            <input type="submit" value="Add Todo" />
        </form>
        </body>
        </html>
  `);
  }
});

app.get("/todos", (req, res) => {
  res.json({
    todos,
    status: 200,
  });
});

app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todoToSend = todos.find((todo) => todo.id === id);

  if (!todoToSend) {
    res.json({
      status: 404,
    });
  }
  res.json({
    todo: todoToSend,
    status: 200,
  });
});

app.post("/todos", (req, res) => {
  console.log(req.body);
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    description: req.body.description,
  };

  todos.push(todo);
  res.json({
    id: todo.id,
    status: 201,
  });
});

app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const updateTodo = req.body;
  const updateTodoIndex = todos.findIndex((todo) => todo.id === id);

  if (updateTodoIndex === -1) {
    res.json({
      status: 404,
    });
  }

  todos[updateTodoIndex] = updateTodo;
  res.json({
    todo: todos[updateTodoIndex],
    status: 200,
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const deleteTodoIndex = todos.findIndex((todo) => todo.id === id);

  if (deleteTodoIndex === -1) {
    res.json({
      status: 404,
    });
  }

  const deletedTodo = todos.splice(deleteTodoIndex, 1);
  res.json({
    todo: deletedTodo,
    status: 200,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
