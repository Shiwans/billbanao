import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Box } from '@mui/material';
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import { Dashboard, People, LocalShipping, ShoppingCart, Payment, Assessment, Today, AccountCircle, Settings, Logout, Login } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const token = localStorage.getItem('token'); // Check if user is authenticated

  const partiesItems = [
    { text: 'Customers', icon: <People />, link: '/customer' },
    { text: 'Suppliers', icon: <LocalShipping />, link: '/supplier' },
  ];

  const billsItems = [
    { text: 'Sale', icon: <ShoppingCart />, link: '/sale' },
    { text: 'Purchase', icon: <BiSolidPurchaseTagAlt />, link: '/purchase' },
    { text: 'Payment', icon: <Payment />, link: '/payment' },
  ];
  
  const otherItems = [
    { text: 'Today', icon: <Today />, link: '/today' },
    { text: 'Profile', icon: <AccountCircle />, link: '/profile' },
    { text: 'Reports', icon: <Assessment />, link: '/data' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isSmallScreen ? 60 : 170,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSmallScreen ? 60 : 170,
          boxSizing: 'border-box',
          backgroundColor: '#1e2a38',
          color: '#fff',
        },
      }}
    >
      {!isSmallScreen && (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>BillBanao</Typography>
        </Box>
      )}

      <Divider />

      <List>
        <ListItem button component={Link} to="/" aria-label="Dashboard">
          <ListItemIcon sx={{ color: '#fff' }}>
            <Dashboard />
          </ListItemIcon>
          {!isSmallScreen && <ListItemText primary="Dashboard" />}
        </ListItem>
      </List>

      <Divider />

      {!isSmallScreen && (
        <Typography variant="caption" color="lightgray" sx={{ paddingLeft: 1 }}>PARTIES</Typography>
      )}
      <List>
        {partiesItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.link} aria-label={item.text}>
            <ListItemIcon sx={{ color: '#fff' }}>
              {item.icon}
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>

      <Divider />

      {!isSmallScreen && (
        <Typography variant="caption" color="lightgray" sx={{ paddingLeft: 1 }}>BILLS</Typography>
      )}
      <List>
        {billsItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.link} aria-label={item.text}>
            <ListItemIcon sx={{ color: '#fff' }}>
              {item.icon}
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>

      <Divider />

      {!isSmallScreen && (
        <Typography variant="caption" color="lightgray" sx={{ paddingLeft: 1 }}>OTHER</Typography>
      )}
      <List>
        {otherItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.link} aria-label={item.text}>
            <ListItemIcon sx={{ color: '#fff' }}>
              {item.icon}
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ marginTop: 'auto' }}>
        <List>
          {token ? (
            <>
              <ListItem button aria-label="Logout" onClick={handleLogout}>
                <ListItemIcon sx={{ color: '#fff' }}>
                  <Logout />
                </ListItemIcon>
                {!isSmallScreen && <ListItemText primary="Logout" />}
              </ListItem>
            </>
          ) : (
            <ListItem button component={Link} to="/login" aria-label="Login">
              <ListItemIcon sx={{ color: '#fff' }}>
                <Login />
              </ListItemIcon>
              {!isSmallScreen && <ListItemText primary="Login" />}
            </ListItem>
          )}
           {/* <ListItem button component={Link} to="/setting" aria-label="Settings">
            <ListItemIcon sx={{ color: '#fff' }}>
              <Settings />
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary="Settings" />}
          </ListItem>  */}
        </List>
      </Box>
    </Drawer>
  );
};

export default Navbar;
