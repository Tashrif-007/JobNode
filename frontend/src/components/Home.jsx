import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Drawer, Button, List, ListItem, ListItemText } from '@mui/material';

const Home = () => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const getById = async() => {
      try {
        const res = await fetch(`http://localhost:3500/auth/getUserById/${user.userId}`);
        const data = await res.json();
        if(res.ok) {
          setUserName(data.name);
        } else {
          console.error(data.error);
        }
      } catch (error) {
          console.error(error.message);
      }
  }

  useEffect(() => {
    if(user?.userId) {
      getById();
    }
  },[user?.userId]);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
        <Link to="/" className="text-2xl font-bold">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 inline-block mr-2" />
          JobNode
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/posts" className="hover:underline">
            Posts
          </Link>
          <Link to="/applications" className="hover:underline">
            Applications
          </Link>
          <Link to="/chats" className="hover:underline">
            Chats
          </Link>
          {user ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleDrawer(true)}
              className="capitalize"
            >
              {userName || 'Loading...'}
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="w-64 p-4" onKeyDown={toggleDrawer(false)}>
          <h2 className="text-xl font-bold mb-4">Profile Options</h2>
          <List>
            <ListItem button>
              <ListItemText primary="Option 1" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Option 2" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      </Drawer>

      {/* Hero Section */}
      <section className="hero bg-gray-100 text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to JobNode</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your one-stop platform for managing posts, applications, and chats seamlessly.
        </p>
        <Link to="/posts">
          <Button variant="contained" color="primary" size="large">
            Explore Posts
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
