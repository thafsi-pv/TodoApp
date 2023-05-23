import { useEffect, useRef, useState } from "react";
import "../Todo/Todo.css";
import { BsFillPencilFill, BsFillTrash3Fill, BsCircle } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import {
  TODO_API,
  TODO_DELETECOMPLETED_API,
  TODO_FILTERLIST_API,
  TODO_GETBYID_API,
} from "../../constants/constants";

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
    getTodoList();
    inputRef.current.focus();
  }, []);

  const getTodoList = async () => {
    const data = await axios(TODO_API);
    setTodoList(data?.data);
  };

  useEffect(() => {
    let count = todoList.filter((item) => item.isCompleted == false).length;
    setItemLeft(count);
  }, [todoList]);

  const handleAddTodo = async () => {
    try {
      if (newTodo) {
        const data = await axios(TODO_API, {
          method: "POST",
          data: {
            todo: newTodo,
          },
        });
        setTodoList(data?.data);
        setNewTodo("");
        todoListRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("An empty world is impossible!");
      }
      inputRef.current.focus();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const todoIsCompleted = async (id) => {
    const data = await axios(TODO_API, {
      method: "PATCH",
      data: {
        id: id,
      },
    });
    setTodoList(data?.data);
  };

  const todoDelete = async (id) => {
    const data = await axios(TODO_API, {
      method: "DELETE",
      data: { id },
    });

    setTodoList(data?.data);
  };

  const handleTodoEdit = async (id) => {
    setEditTodeId(id);
    const data = await axios(TODO_GETBYID_API, {
      method: "POST",
      data: { id },
    });

    setEditTodo(data?.data[0].todo);
    setTimeout(() => inputEditRef.current.focus(), 0);
  };

  const updateTodo = async () => {
    try {
      if (editTodo) {
        const data = await axios(TODO_API, {
          method: "PUT",
          data: {
            id: editTodoId,
            todo: editTodo,
            isCompleted: false,
          },
        });
        console.log("🚀 ~ file: Todo.jsx:102 ~ updateTodo ~ data:", data)
        setTodoList(data?.data);
        setEditTodeId("");
      } else alert("An empty world is impossible!..");
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const clearCompleted = async () => {
    const data = await axios(TODO_DELETECOMPLETED_API, {
      method: "DELETE",
    });

    setTodoList(data?.data);
    setFilterType("all");
  };

  const handleFilterlist = async (type) => {
    setFilterType(type);
    const data = await axios(TODO_FILTERLIST_API, {
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
              <p
                className={`${filterType === "all" ? "active" : ""}`}
                onClick={() => handleFilterlist("all")}>
                All
              </p>
              <p
                className={`${filterType === "active" ? "active" : ""}`}
                onClick={() => handleFilterlist("active")}>
                Active
              </p>
              <p
                className={`${filterType === "completed" ? "active" : ""}`}
                onClick={() => handleFilterlist("completed")}>
                Completed
              </p>
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
