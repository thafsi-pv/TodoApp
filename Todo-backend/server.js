const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());

const todoList = require("./TodoList.json");

const userList = [{ name: "abc", mail: "abc@gmail.com" }];
app.get("/api/todo", (req, res) => {
  res.json(todoList);
});

app.post("/api/todo", (req, res) => {
  todoList.unshift(req.body.todo);
  res.json(todoList);
});

app.patch("/api/todo", (req, res) => {
  const { id } = req.body;
  const newlist = todoList.map((item) => {
    if (item.id == id) {
      console.log(item.id, "iddd");
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
  console.log("🚀 ~ file: server.js:37 ~ app.delete ~ id:", id);
  const newlist = todoList.filter((item) => item.id != id);

  fs.writeFileSync("./TodoList.json", JSON.stringify(newlist));
  res.json(newlist);
});

app.post("/api/gettodobyid", (req, res) => {
  const { id } = req.body;
  console.log("🚀 ~ file: server.js:45 ~ app.get ~ id:", id);
  const todo = todoList.filter((item) => item.id == id);
  res.json(todo);
});

app.put("/api/todo", (req, res) => {
  const { id, todo } = req.body;
  const index = todoList.findIndex((item) => item.id == id);
  const newlist = todoList.map((item) => {
    if (item.id == id) {
      return { ...item, todo: todo, isCompleted: false };
    } else {
      return { ...item };
    }
  });
  fs.writeFileSync("./TodoList.json", JSON.stringify(newlist));
  res.json(newlist);
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
