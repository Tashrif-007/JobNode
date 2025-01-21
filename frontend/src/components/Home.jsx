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

  const getById = async () => {
    try {
      const res = await fetch(`http://localhost:3500/auth/getUserById/${user.userId}`);
      const data = await res.json();
      if (res.ok) {
        setUserName(data.name);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      getById();
    }
  }, [user?.userId]);

  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Navbar */}
      <header className="container mx-auto py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 inline-block mr-2" />
          JobNode
        </Link>
        <nav className="flex gap-5 items-center">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/posts" className="hover:text-blue-500">
                Posts
              </Link>
            </li>
            <li>
              <Link to="/applications" className="hover:text-blue-500">
                Applications
              </Link>
            </li>
            <li>
              <Link to="/chats" className="hover:text-blue-500">
                Chats
              </Link>
            </li>
          </ul>
          {user ? (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleDrawer(true)}
              className="capitalize"
            >
              {userName || 'Loading...'}
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="contained" color="secondary">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </header>

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
      <section className="container mx-auto py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Innovating the Future of Tech</h2>
          <p className="mb-6 text-gray-600">
            We create next-gen technology solutions that empower businesses to
            achieve more. Discover the power of innovation with TechStartup.
          </p>
          <Link
            to="/posts"
            className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
          >
            Explore Posts
          </Link>
        </div>
        <div className="md:w-1/3">
          <img
            src="https://placehold.co/600x400"
            alt="Innovative Technology"
            className="rounded-md shadow-md"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-semibold text-center mb-6">About Us</h2>
        <p className="text-center text-gray-600">
          At TechStartup, we specialize in creating state-of-the-art solutions
          that help innovators, entrepreneurs, and businesses gain the
          competitive edge they need to thrive in the 21st century.
        </p>
      </section>

      {/* Services Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-semibold text-center mb-6">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Software Development</h3>
            <p className="text-gray-600">
              Transform your ideas into reality with our custom software
              solutions that are tailored to meet your needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Cloud Solutions</h3>
            <p className="text-gray-600">
              Maximize efficiency and drive scalability with our cutting-edge
              cloud services that provide flexibility and security.
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">IT Consulting</h3>
            <p className="text-gray-600">
              Leverage our expertise to navigate today’s fast-paced tech
              landscape with informed insights and strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>© {new Date().getFullYear()} JobNode. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
