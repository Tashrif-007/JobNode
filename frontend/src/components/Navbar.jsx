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
        backgroundColor: '#f8f9ff', 
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
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.3s ease'
            }
          }}
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src="./logo.png" 
              alt="Logo" 
              style={{ 
                width: 40, 
                height: 40, 
                marginRight: 10,
                cursor: 'pointer',
                filter: 'drop-shadow(0px 2px 4px rgba(126, 34, 206, 0.3))' 
              }} 
              onClick={()=>navigate("/")}
            />
          </motion.div>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #9c6bfa 0%, #7d5cf4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
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
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#555',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 107, 250, 0.08)',
                color: '#7d5cf4',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Posts
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/applications"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#555',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 107, 250, 0.08)',
                color: '#7d5cf4',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Applications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/chats"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#555',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 107, 250, 0.08)',
                color: '#7d5cf4',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Chats
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/recommendations"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#555',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 107, 250, 0.08)',
                color: '#7d5cf4',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Recommendations
          </Button>
          {userType==='JobSeeker' &&
          <Button 
            color="inherit" 
            component={Link} 
            to="/offer"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#555',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(156, 107, 250, 0.08)',
                color: '#7d5cf4',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Offers
          </Button>
          }
          
          {/* User Profile or Login */}
          {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton 
                  onClick={handleMenuOpen}
                  sx={{ 
                    backgroundColor: 'rgba(156, 107, 250, 0.15)', 
                    color: '#7d5cf4',
                    transition: 'all 0.3s ease',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(156, 107, 250, 0.25)',
                      boxShadow: '0 4px 8px rgba(156, 107, 250, 0.2)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      backgroundColor: 'rgba(156, 107, 250, 0.9)',
                      boxShadow: '0 0 0 2px white',
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials()}
                  </Avatar>
                </IconButton>
              </motion.div>

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
                    filter: 'drop-shadow(0px 2px 8px rgba(156, 107, 250, 0.2))',
                    mt: 1.5,
                    width: 230,
                    borderRadius: '12px',
                    border: '1px solid rgba(156, 107, 250, 0.1)',
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
                      borderTop: '1px solid rgba(156, 107, 250, 0.1)',
                      borderLeft: '1px solid rgba(156, 107, 250, 0.1)',
                    },
                  },
                }}
              >
                <Box sx={{ p: 2, pb: 1, pt: 1.5, backgroundColor: 'rgba(156, 107, 250, 0.05)' }}>
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
                    if(userType==='JobSeeker')
                    navigate("/profile");
                    else navigate("companyprofile")
                    handleMenuClose();
                  }}
                  sx={{ 
                    py: 1.5,
                    mx: 1,
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(156, 107, 250, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" style={{ color: '#7d5cf4' }} />
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
                    mx: 1,
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.08)'
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained"
                component={Link} 
                to="/login"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#9c6bfa', 
                  borderRadius: '10px',
                  padding: '8px 20px',
                  boxShadow: '0 4px 10px rgba(156, 107, 250, 0.3)',
                  '&:hover': { 
                    backgroundColor: '#7d5cf4',
                    boxShadow: '0 6px 12px rgba(156, 107, 250, 0.4)'
                  }
                }}
              >
                Login
              </Button>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;