import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { red } from "@mui/material/colors";

const defaultTheme = createTheme();

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToTodo, setRedirectToTodo] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isGoogleAuthInitiated =
      localStorage.getItem("isGoogleAuthInitiated") === "true";

    const fetchGoogleUserData = async () => {
      if (
        isGoogleAuthInitiated &&
        new URLSearchParams(location.search).get("success") === "true"
      ) {
        try {
          const url = `${process.env.REACT_APP_BACKEND_URL}/auth/login/success`;
          const { data } = await axios.get(url, { withCredentials: true });
          const userData = data.user._json;
          setName(userData.name);
          setEmail(userData.email);
          console.log("Google user data:", userData.name);
        } catch (err) {
          console.log(err);
        }
        localStorage.removeItem("isGoogleAuthInitiated");
      }
    };

    fetchGoogleUserData();
  }, [location]);

  const googleAuth = () => {
    localStorage.setItem("isGoogleAuthInitiated", "true");
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.error("Fill in all the details", {
        style: {
          backgroundColor: "white",
          WebkitTextFillColor: "red",
        },
      });
      return;
    }

    const data = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        data
      );

      if (response.status === 201) {
        const { user, token } = response.data;
        localStorage.setItem("userInfo", JSON.stringify({ user, token }));
        console.log("user", user);
        toast.success("SignUp Successful", {
          style: {
            backgroundColor: "white",
            WebkitTextFillColor: "green",
          },
        });
        setRedirectToTodo(true);
      } else {
        console.log("Sign up failed");
      }
    } catch (error) {
      toast.error("User with this Email Already Exists", {
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  className="textfield"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="textfield"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="textfield"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              Sign Up
            </Button>
            <Button
              onClick={googleAuth}
              fullWidth
              variant="contained"
              sx={{
                mb: 2,
                backgroundColor: "#4285F4",
                color: "white",
                textTransform: "none",
              }}
              startIcon={
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  style={{ width: "20px", height: "20px" }}
                />
              }
            >
              Continue with Google
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer
        className="custom-toast"
        position="top-center"
        autoClose={3000}
        hideProgressBar
      />
    </ThemeProvider>
  );
}
