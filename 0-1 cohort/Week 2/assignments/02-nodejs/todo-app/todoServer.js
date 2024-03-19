const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;
// const todos = require("./todos.json");

let todos = fs.readFileSync("./todos.json", "utf-8");
todos = JSON.parse(todos);

app.use(bodyParser.urlencoded({ extended: false }));
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
                  <form class="delete-form" method="POST" action="/todos/${todo.id}">
                    <input type="submit" value="Delete" />
                  </form>
                </li>`
              )
              .join("")}
        </ul>
        <form id="add-form" method="POST" action="/todos">
            <input type="text" name="title" />
            <input type="submit" value="Add Todo" />
        </form>
        <script>
        document.querySelectorAll('.delete-form').forEach(form => {
          form.addEventListener('submit', function(e) {
              e.preventDefault();
              fetch(form.action, {
                  method: 'DELETE',
              })
              .then(response => response.json())
              .then(data => {
                  console.log(data);
                  // Remove the li element
                  form.parentElement.remove();
              })
              .catch((error) => console.error('Error:', error));
          });
      });

      document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        let title = document.querySelector('input[name="title"]').value;
        fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: title}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = '/';
        })
        .catch((error) => console.error('Error:', error));
    });
        </script>
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
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
  };

  todos.push(todo);
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
    if (err) {
      res.json({
        status: 500,
      });
    }
  });

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
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
    if (err) {
      res.json({
        status: 500,
      });
    }
  });
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
fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
  if (err) {
    res.json({
      status: 500,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
