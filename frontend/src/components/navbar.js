import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import UserIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove userInfo from local storage
    localStorage.removeItem("userInfo");

    // Navigate to home route
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              pl: 12,
            }}
          >
            <FormatListBulletedIcon sx={{ mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TODO
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ p: 1, color: "white" }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="User Settings">
              <IconButton sx={{ p: 1, color: "white" }}>
                <Avatar>
                  <UserIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
