import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { isLoggedIn, logout } from "../auth"; // Import auth functions

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = (open) => () => {
    setSidebarOpen(open);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          {/* Sidebar Toggle Button */}
          {isLoggedIn() && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* App Name */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>

          {/* Top Navbar - Login/Logout Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {isLoggedIn() ? (
              <Button color="inherit" onClick={logout}>Logout</Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleSidebar(false)}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>

            {/* Fleet Option Only If Logged In */}
            {isLoggedIn() && (
              <ListItem button component={Link} to="/fleet">
                <ListItemText primary="Fleet" />
              </ListItem>
            )}
            {/* Fleet Option Only If Logged In */}
            {isLoggedIn() && (
              <ListItem button component={Link} to="/fleet-form">
                <ListItemText primary="Fleet form" />
              </ListItem>
            )}
            {/* Fleet Option Only If Logged In */}
            {isLoggedIn() && (
              <ListItem button component={Link} to="/fleet-model-form">
                <ListItemText primary="Fleet model form" />
              </ListItem>
            )}
            {/* Fleet Option Only If Logged In */}
            {isLoggedIn() && (
              <ListItem button component={Link} to="/fleet-brand-form">
                <ListItemText primary="Fleet brand form" />
              </ListItem>
            )}
            {/* Fleet Option Only If Logged In */}
            {isLoggedIn() && (
              <ListItem button component={Link} to="/brand">
                <ListItemText primary="Brand list" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
