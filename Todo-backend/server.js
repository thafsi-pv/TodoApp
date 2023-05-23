const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.use(cors());
app.use(express.json());

const todoList = require("./TodoList.json");

const userList = [{ name: "abc", mail: "abc@gmail.com" }];
app.get("/api/todo", (req, res) => {
  res.json(todoList);
});

app.post("/api/todo", (req, res) => {
  const { todo } = req.body;
  if (!("todo" in req.body)) {
    res.status(400).json({
      message: `${JSON.stringify(
        req.body
      )}:This attribute is not accepted, Required attributes: todo`,
    });
    return;
  }
  const newitem = {
    id: uuidv4(),
    todo: todo,
    isCompleted: false,
  };
  const todolist = todoList;
  todolist.unshift(newitem);
  fs.writeFileSync("./TodoList.json", JSON.stringify(todolist));
  res.json(todolist);
});

app.patch("/api/todo", (req, res) => {
  const { id } = req.body;
  const newlist = todoList.map((item) => {
    if (item.id == id) {
      return { ...item, isCompleted: !item.isCompleted };
    } else {
      return { ...item };
    }
  });
  fs.writeFileSync("./TodoList.json", JSON.stringify(newlist));
  res.json(newlist);
});

app.delete("/api/todo", (req, res) => {
  const { id } = req.body;
  const newlist = todoList.filter((item) => item.id != id);
  fs.writeFileSync("./TodoList.json", JSON.stringify(newlist));
  res.json(newlist);
});

app.post("/api/gettodobyid", (req, res) => {
  const { id } = req.body;
  const todo = todoList.filter((item) => item.id == id);
  res.json(todo);
});

app.put("/api/todo", (req, res) => {
  const { id, todo, isCompleted } = req.body;
  var missedItem = [];
  for (let key in { id, todo, isCompleted }) {
    if (!req.body.hasOwnProperty(key)) {
      missedItem.push(key);
    }
  }
  if (!missedItem.length === 0) {
    res
      .status(400)
      .json({ message: `missing the following item: ${missedItem}` });
    return;
  } else {
    const newlist = todoList.map((item) => {
      if (item.id == id) {
        return { ...item, todo: todo, isCompleted: isCompleted || false };
      } else {
        return { ...item };
      }
    });
    fs.writeFileSync("./TodoList.json", JSON.stringify(newlist));
    res.json(newlist);
  }
});

app.delete("/api/deleteiscompleted", (req, res) => {
  const newlist = todoList.filter((item) => item.isCompleted != true);
  fs.writeFileSync("./TodoList.json", JSON.stringify(newlist));
  res.json(newlist);
});

app.post("/api/filterlist", (req, res) => {
  const { type } = req.body;
  if (type === "all") {
    res.json(todoList);
  } else if (type === "active") {
    const newlist = todoList.filter((item) => item.isCompleted != true);
    res.json(newlist);
  } else if (type === "completed") {
    const newlist = todoList.filter((item) => item.isCompleted == true);
    res.json(newlist);
  }
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Server started in port ${PORT}`));
