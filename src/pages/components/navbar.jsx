// src/Navbar.js

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './navbar.css'; // Import your CSS file

const Navbar = () => {
  return (
    <AppBar position="static" className="navbar" id="navbar">
      <Toolbar>
        <img src="https://www.infersol.com/wp-content/uploads/2020/02/logo.png" alt="Logo" className="logo" />
        <Box display="flex" alignItems="center" className="userBox">
          <Typography variant="body1" className="username" id="username">
            Thiru   
          </Typography>
          <Avatar className="avatar">
            <AccountCircleIcon />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
