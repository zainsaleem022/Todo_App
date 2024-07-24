import React, { useState } from 'react';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToTodo, setRedirectToTodo] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email == "" || password == "")
      {
          toast.error('Fill in all the details');
          return
      }

    const data = {
      email: email,
      password: password,
    };

    // console.log(data);

    try {
      const response = await axios.post("http://localhost:5000/signin", data);

      if (response.status === 200) {

        const { user, token } = response.data;
        localStorage.setItem('userInfo', JSON.stringify({ user, token }));
        // console.log('Sign in successful');
        // console.log("user", user)
        toast.success('Login Successful');
        setRedirectToTodo(true);
        // Handle success, e.g., redirect or show a success message
      } else {
        // console.log('Sign in failed');
        // Handle error, e.g., show an error message
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Invalid credentials');
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
