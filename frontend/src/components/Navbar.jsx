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
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
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
                    color: 'rgb(97 27 248 / 1)' 
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      backgroundColor: 'rgb(97 27 248 / 1)' 
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
                      navigate("/profile")
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
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
    </motion.div>
  );
};

export default Navbar;
