import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { isLoggedIn, logout } from "../auth";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (open) => () => {
    setSidebarOpen(open);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn() && (
            <IconButton edge="start" color="inherit" onClick={toggleSidebar(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Fleet management system
          </Typography>
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

      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleSidebar(false)}>
          <List>

            {/* Reports (Always Expanded) */}
            {isLoggedIn() && (
              <>
                <ListItemButton>
                  <ListItemText primary="Reports" />
                </ListItemButton>
                <List component="div" disablePadding>
                  <ListItemButton component={Link} to="/zoneReport" sx={{ pl: 4 }}>
                    <ListItemText primary="Zone report" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/utilizationReport" sx={{ pl: 4 }}>
                    <ListItemText primary="Fleet utilization" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/fuelReport" sx={{ pl: 4 }}>
                    <ListItemText primary="Fuel usage" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/trackPoints" sx={{ pl: 4 }}>
                    <ListItemText primary="Track points" />
                  </ListItemButton>                  
                </List>
                
              </>
            )}

            {/* Fleet (Always Expanded) */}
            {isLoggedIn() && (
              <>
                <ListItemButton>
                  <ListItemText primary="Fleet registration" />
                </ListItemButton>
                <List component="div" disablePadding>
                  <ListItemButton component={Link} to="/fleet" sx={{ pl: 4 }}>
                    <ListItemText primary="Fleet" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/brand" sx={{ pl: 4 }}>
                    <ListItemText primary="Fleet brand" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/CarModelManager" sx={{ pl: 4 }}>
                    <ListItemText primary="Fleet model" />
                  </ListItemButton>
                </List>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
