import { useEffect, useRef, useState } from "react";
import "../Todo/Todo.css";
import { BsFillPencilFill, BsFillTrash3Fill, BsCircle } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import axios from "axios";

export const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState("");
  const [editTodoId, setEditTodeId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const inputRef = useRef(null);
  const inputEditRef = useRef(null);
  const todoListRef = useRef(null);
  const [itemLeft, setItemLeft] = useState();

  useEffect(() => {
    //const dt = localStorage.getItem("TFR-TODO");
    //dt && setTodoList(JSON.parse(localStorage.getItem("TFR-TODO")));

    getTodoList();
    inputRef.current.focus();
  }, []);

  const getTodoList = async () => {
    const data = await axios("http://localhost:3005/gettodo");
    console.log("🚀 ~ file: Todo.jsx:28 ~ getTodoList ~ data:", data);
    setTodoList(data?.data);
  };

  useEffect(() => {
    let count = todoList.filter((item) => item.isCompleted == false).length;
    setItemLeft(count);
  }, [todoList]);

  const handleAddTodo = () => {
    //const data = localStorage.getItem("TFR-TODO");
    if (newTodo) {
      const newitem = {
        id: Math.random().toString(36).substr(2, 9),
        todo: newTodo,
        isCompleted: false,
      };
      addnewTodo(newitem);
      setNewTodo("");
      todoListRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("An empty world is impossible!");
    }
    inputRef.current.focus();
  };

  const addnewTodo = async (newitem) => {
    const data = await axios("http://localhost:3005/addtodo", {
      method: "POST",
      data: {
        todo: newitem,
      },
    });
    setTodoList(data?.data);
  };

  const todoIsCompleted = async (id) => {
    const data = await axios("http://localhost:3005/iscompleted", {
      method: "PATCH",
      data: {
        id: id,
      },
    });
    setTodoList(data?.data);
  };

  const todoDelete = async (id) => {
    //const newlist = todoList.filter((item) => item.id != id);

    const data = await axios("http://localhost:3005/delete", {
      method: "DELETE",
      data: { id },
    });

    setTodoList(data?.data);
    //localStorage.setItem("TFR-TODO", JSON.stringify(newlist));
  };

  const handleTodoEdit = async (id) => {
    console.log("🚀 ~ file: Todo.jsx:87 ~ handleTodoEdit ~ id:", id);
    setEditTodeId(id);
    const data = await axios("http://localhost:3005/gettodobyid", {
      method: "POST",
      data: { id },
    });
    console.log("🚀 ~ file: Todo.jsx:91 ~ handleTodoEdit ~ data:", data);

    setEditTodo(data?.data[0].todo);

    // const editTodoList = JSON.parse(localStorage.getItem("TFR-TODO"));
    // const index = editTodoList.findIndex((obj) => obj.id == id);
    // setEditTodo(editTodoList[index].todo);
    setTimeout(() => inputEditRef.current.focus(), 0);
  };

  const updateTodo = async () => {
    if (editTodo) {
      const data = await axios("http://localhost:3005/edittodo", {
        method: "PUT",
        data: {
          id: editTodoId,
          todo: editTodo,
        },
      });
      console.log("🚀 ~ file: Todo.jsx:113 ~ updateTodo ~ data:", data);
      setTodoList(data?.data);

      // const editTodoList = JSON.parse(localStorage.getItem("TFR-TODO"));
      // const index = editTodoList.findIndex((obj) => obj.id == editTodoId);
      // editTodoList[index].todo = editTodo;
      // editTodoList[index].isCompleted = false;
      // setTodoList(editTodoList);
      // localStorage.setItem("TFR-TODO", JSON.stringify(editTodoList));
      setEditTodeId("");
    } else alert("An empty world is impossible!..");
  };

  const clearCompleted = async () => {
    // const newList = todoList.filter((item) => item.isCompleted != true);

    const data = await axios("http://localhost:3005/deleteiscompleted", {
      method: "DELETE",
    });

    setTodoList(data?.data);
    setFilterType('all')
    // localStorage.setItem("TFR-TODO", JSON.stringify(newList));
  };

  const handleFilterlist = async (type) => {
    setFilterType(type);
    const data = await axios("http://localhost:3005/filterlist", {
      method: "POST",
      data: {
        type,
      },
    });
    setTodoList(data?.data);
  };

  return (
    <div className="todo-container">
      <div className="main-container">
        <div className="todo">
          <div className="todo-title">
            <p>Todo List</p>
          </div>
          <div className="todo-add">
            <div className="add-input">
              <input
                type="text"
                placeholder="What needs to be done?"
                name="addnew"
                id=""
                ref={inputRef}
                value={newTodo}
                onChange={() => setNewTodo(event.target.value)}
              />
              {newTodo && (
                <span>
                  <IoIosClose
                    className="clear-icon"
                    onClick={() => {
                      setNewTodo("");
                      inputRef.current.focus();
                    }}
                  />
                </span>
              )}
            </div>
            <button onClick={() => handleAddTodo()}>ADD TODO</button>
          </div>
          <div className="todo-list" ref={todoListRef}>
            {todoList?.map((item) => (
              <div key={item.id} className="todo-item">
                {editTodoId != "" && editTodoId === item.id ? (
                  <div className="edit-todo">
                    <div className="edit-input">
                      <input
                        type="text"
                        name=""
                        id=""
                        ref={inputEditRef}
                        value={editTodo}
                        onChange={() => setEditTodo(event.target.value)}
                      />
                      {editTodo && (
                        <span>
                          <IoIosClose
                            className="clear-icon"
                            onClick={() => {
                              setEditTodo("");
                              setTimeout(() => inputEditRef.current.focus(), 0);
                            }}
                          />
                        </span>
                      )}
                    </div>
                    <div className="edit-action">
                      <button onClick={() => updateTodo(item.id)}>Save</button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditTodeId("")}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="todo-name"
                      onClick={() => todoIsCompleted(item.id)}>
                      <span>
                        {!JSON.parse(item.isCompleted) ? (
                          <BsCircle className="uncheck-icon" />
                        ) : (
                          <AiOutlineCheckCircle className="check-icon" />
                        )}
                      </span>
                      <p
                        className={
                          JSON.parse(item.isCompleted)
                            ? "item-title item-completed"
                            : "item-title"
                        }>
                        {item.todo}
                      </p>
                    </div>
                    <div className="item-action">
                      <BsFillPencilFill
                        className="action-edit"
                        onClick={() => handleTodoEdit(item.id)}
                      />
                      <BsFillTrash3Fill
                        className="action-delete"
                        onClick={() => todoDelete(item.id)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="todo-footer">
            <div className="">
              <p>{itemLeft} Item left</p>
            </div>
            <div className="btn-filter">
              <p className={`${filterType==='all'?'active':''}`} onClick={() => handleFilterlist("all")}>
                All
              </p>
              <p className={`${filterType==='active'?'active':''}`} onClick={() => handleFilterlist("active")}>Active</p>
              <p className={`${filterType==='completed'?'active':''}`} onClick={() => handleFilterlist("completed")}>Completed</p>
            </div>
            <div className="">
              <p className="clear-completed" onClick={() => clearCompleted()}>
                Clear Completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
