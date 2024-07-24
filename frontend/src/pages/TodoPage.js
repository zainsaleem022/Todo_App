import React, { useEffect, useState } from "react";
import axios from "axios";
import NAVBAR from "../components/navbar";
import TODOBOX from "../components/todoBox";
import { Box, Button, Container } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [currentUser, setCurrentUser] = useState(userInfo);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/todo/${currentUser.user.user_id}`,
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
      toast.error("TODO cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/todo/",
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
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDeleteTodo = async (note_id) => {
    try {
      await axios.delete(`http://localhost:5000/todo/${note_id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setTodos(todos.filter((todo) => todo.note_id !== note_id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditTodo = async (note_id) => {
    const index = todos.findIndex((todo) => todo.note_id === note_id);

    try {
      const response = await axios.put(
        `http://localhost:5000/todo/${note_id}`,
        {
          note_text: todos[index].note_text,
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
    const updatedTodos = [...todos];
    const index = updatedTodos.findIndex((todo) => todo.note_id === note_id);

    if (index !== -1) {
      updatedTodos[index] = {
        ...updatedTodos[index],
        note_text: editedTodoText,
      };
      setTodos(updatedTodos);
    } else {
      console.error(`Todo with note_id ${note_id} not found.`);
    }
  };

  return (
    <>
      <NAVBAR />
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TODOBOX note={newTodo} setNote={setNewTodo} isFirst={true} />
          <Button
            variant="contained"
            onClick={handleAddTodo}
            sx={{
              mr: {
                xs: 0,
                sm: 2,
                md: 2,
              },
              ml: { xs: 2, sm: 2, md: 2 },
            }}
          >
            +
          </Button>
        </Box>
        {todos.map((todo) => (
          <Box
            key={todo.note_id}
            sx={{ display: "flex", alignItems: "center", mt: 2 }}
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
