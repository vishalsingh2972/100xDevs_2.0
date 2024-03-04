const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

let todos = fs.readFileSync('./todos.json', 'utf-8');
todos = JSON.parse(todos);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  if (!todos) {
    res.send('No todos found');
  } else {
    res.send(`
        <h1>Todo App</h1>
        <ul>
            ${todos
              .map(
                (todo) =>
                  `<li>${todo.title}  
                <form method="POST" action=/todos/${todo.id}>
                    <input type="submit" value="Delete" />
                </form>
                </li>`
              )
              .join('')}
        </ul>
        <form method="POST" action="/todos">
            <input type="text" name="title" />
            <input type="submit" value="Add Todo" />
        </form>
    `);
  }
});

//route to get all todos
app.get('/todos', (req, res) => {
  res.send(todos);
});

//route to get a single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  if (!todo) {
    res.status(404).send('The todo with the given ID was not found');
  }
  res.send(todo);
});

//route to create a todo
app.post('/todos', (req, res) => {
  if (!req.body.title || req.body.title.length < 3) {
    res
      .status(400)
      .send('Title is required and should be minimum 3 characters');
    return;
  }

  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false,
  };

  todos.push(todo);
  fs.writeFile('./todos.json', JSON.stringify(todos), (err) => {
    if (err) {
      console.log(err);
    }
  });
  return res.redirect('/');
});

//route to delete a todo
app.post('/todos/:id', (req, res) => {
  let todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  if (!todo) {
    res.status(404).send('The todo with the given ID was not found');
  }

  const index = todos.indexOf(todo);
  todos.splice(index, 1);
  fs.writeFile('./todos.json', JSON.stringify(todos), (err) => {
    if (err) {
      console.log(err);
    }
  });
  return res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
