import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToTodo, setRedirectToTodo] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === "" || password === "") {
      toast.error("Fill in all the details", {
        style: {
          backgroundColor: "white",
          WebkitTextFillColor: "red",
        },
      });
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/signin`,
        data
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem("userInfo", JSON.stringify({ user, token }));
        toast.success("Login Successful", {
          style: {
            backgroundColor: "white",
            WebkitTextFillColor: "green",
          },
        });
        setRedirectToTodo(true);
      } else {
        toast.error("Invalid credentials", {
          style: {
            backgroundColor: "white",
            WebkitTextFillColor: "red",
          },
        });
      }
    } catch (error) {
      toast.error("Invalid credentials", {
        style: {
          backgroundColor: "white",
          WebkitTextFillColor: "red",
        },
      });
    }
  };

  if (redirectToTodo) {
    return <Navigate to="/todo" />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container align="center">
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </ThemeProvider>
  );
}
