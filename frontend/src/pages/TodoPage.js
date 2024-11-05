import React, { useEffect, useState } from "react";
import axios from "axios";
import NAVBAR from "../components/navbar";
import TODOBOX from "../components/todoBox";
import { Box, Button, Container, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [searchedTodos, setSearchedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [currentUser, setCurrentUser] = useState(userInfo);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/${currentUser.user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.user.user_id) {
      fetchTodos();
    }
  }, [currentUser]);

  const handleAddTodo = async () => {
    if (!newTodo) {
      toast.error("TODO cannot be empty", {
        style: {
          backgroundColor: "white",
          WebkitTextFillColor: "red",
        },
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/todo/`,
        {
          user_id: userInfo.user.user_id,
          note_text: newTodo,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      fetchTodos();
      setNewTodo("");
      toast.success("TODO added successfuly", {
        style: {
          backgroundColor: "white",
          WebkitTextFillColor: "green",
        },
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDeleteTodo = async (note_id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/todo/${note_id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setTodos(todos.filter((todo) => todo.note_id !== note_id));
      setSearchedTodos(
        searchedTodos.filter((todo) => todo.note_id !== note_id)
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditTodo = async (note_id) => {
    let index, text;

    if (searchQuery.trim() === "") {
      index = todos.findIndex((todo) => todo.note_id === note_id);
      text = todos[index].note_text;
    } else {
      index = searchedTodos.findIndex((todo) => todo.note_id === note_id);
      text = searchedTodos[index].note_text;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/todo/${note_id}`,
        {
          note_text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      //fetchTodos();
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const setEditedTodoArray = (note_id, editedTodoText) => {
    let updatedTodos = [];

    if (searchQuery.trim() === "") {
      updatedTodos = [...todos];
    } else {
      updatedTodos = [...searchedTodos];
    }

    const index = updatedTodos.findIndex((todo) => todo.note_id === note_id);
    const originalTodoIndex = todos.findIndex(
      (todo) => todo.note_id === note_id
    );

    if (index !== -1) {
      updatedTodos[index] = {
        ...updatedTodos[index],
        note_text: editedTodoText,
      };

      if (originalTodoIndex != null) {
        todos[originalTodoIndex] = {
          ...todos[originalTodoIndex],
          note_text: editedTodoText,
        };
      }

      if (searchQuery.trim() === "") {
        setTodos(updatedTodos);
      } else {
        setSearchedTodos(updatedTodos);
      }
    } else {
      console.error(`Todo with note_id ${note_id} not found.`);
    }
  };

  const handleSearch = async (searchQuery) => {
    setSearchQuery(searchQuery);
    if (searchQuery.trim() === "") {
      setSearchedTodos([]);
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/todo/search/${currentUser.user.user_id}?query=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setSearchedTodos(response.data);
      } catch (error) {
        console.error("Error searching todos:", error);
      }
    }
  };

  return (
    <>
      <NAVBAR />
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 1,
              width: "70%",
            }}
          >
            <TODOBOX note={newTodo} setNote={setNewTodo} isFirst={true} />
            <Button
              variant="contained"
              onClick={handleAddTodo}
              sx={{
                ml: 2,
                mt: 5,
              }}
            >
              +
            </Button>
          </Box>
          <Box
            sx={{
              mt: 0,
              width: "70%",
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
              color: "white",
              mr: 10,
            }}
          >
            <Box
              component="input"
              placeholder="Search Todos"
              onChange={(e) => handleSearch(e.target.value)}
              sx={{
                width: "70%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "silver",
                color: "black", // Text color
                outline: "none",
              }}
            />
          </Box>
        </Box>

        {(searchQuery.trim() === "" ? todos : searchedTodos).map((todo) => (
          <Box
            key={todo.note_id}
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <TODOBOX
              note={todo.note_text}
              setNote={setEditedTodoArray}
              onEdit={setEditedTodoArray}
              noteKey={todo.note_id}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditTodo(todo.note_id)}
              sx={{ ml: 2 }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteTodo(todo.note_id)}
              sx={{ ml: 2 }}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Container>
      <ToastContainer />
    </>
  );
};

export default TodoPage;
