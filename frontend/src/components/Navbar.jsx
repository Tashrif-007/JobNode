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
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const userType = user?.userType;
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
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
      position="sticky" 
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
        maxWidth: 1690, 
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
              marginRight: 10,
              cursor: 'pointer' 
            }} 
            onClick={()=>navigate("/")}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 'bold' }}
            onClick={()=> navigate("/")}
            style={{
              cursor: 'pointer',
            }}
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
          {userType==='JobSeeker' &&
          <Button 
            color="inherit" 
            component={Link} 
            to="/offer"
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Offers
          </Button>
          }
          
          {/* User Profile or Login */}
          {user ? (
            <>
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ 
                  backgroundColor: 'rgba(126,34,206,0.1)', 
                  color: 'rgb(97 27 248 / 1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(126,34,206,0.2)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    backgroundColor: 'rgb(97 27 248 / 1)',
                    boxShadow: '0 0 0 2px white'
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
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    mt: 1.5,
                    width: 230,
                    borderRadius: '10px',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2, pb: 1, pt: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {user?.email || 'user@example.com'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <MenuItem 
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(126,34,206,0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" style={{ color: 'rgb(97 27 248 / 1)' }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <MenuItem 
                  onClick={() => {
                    logout();
                    handleMenuClose();
                  }}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(211,47,47,0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" style={{ color: '#d32f2f' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" sx={{ color: '#d32f2f' }} />
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