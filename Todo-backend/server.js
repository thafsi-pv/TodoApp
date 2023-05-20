const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());

const todoList = require("./TodoList.json");

const userList = [{ name: "abc", mail: "abc@gmail.com" }];
app.get("/gettodo", (req, res) => {
  res.json(todoList);
});

app.post("/addtodo", (req, res) => {
  todoList.unshift(req.body.todo);
  res.json(todoList);
});

app.patch("/iscompleted", (req, res) => {
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

const PORT = 3005;
app.listen(PORT, () => console.log(`Server started in port ${PORT}`));
