import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  IconButton, 
  Avatar,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getInitials = () => {
    if (!user || !user.name) return <AccountCircleIcon />;
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        top: 0,
        left: 0,
        zIndex: 1100,
        width: '100vw'
      }}
      className='min-w-full'
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        maxWidth: 1600, 
        margin: '0 auto', 
        padding: '15px',
        width: '100%' 
      }}>
        {/* Logo and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="./logo.png" 
            alt="Logo" 
            style={{ 
              width: 40, 
              height: 40, 
              marginRight: 10 
            }} 
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 'bold' }}
          >
            JobNode
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/posts"
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Posts
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/applications"
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Applications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/chats"
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Chats
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/recommendations"
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Recommendations
          </Button>
          

          {/* User Profile or Login */}
          {user ? (
            <>
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ 
                  backgroundColor: 'rgba(126,34,206,0.1)', 
                  color: '#7E22CE' 
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    backgroundColor: '#7E22CE' 
                  }}
                >
                  {getInitials()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    // Navigate to profile
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    // Navigate to settings
                  }}
                >
                  Settings
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    logout();
                    handleMenuClose();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="primary" 
              variant="contained"
              component={Link} 
              to="/login"
              sx={{ 
                textTransform: 'none',
                backgroundColor: '#7E22CE', 
                '&:hover': { backgroundColor: '#6A1B9A' }
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;