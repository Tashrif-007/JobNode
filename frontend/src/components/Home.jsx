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
          <img src="./logo.png" alt="Logo" className="w-8 h-auto inline-block mr-2" />
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
            <button
              onClick={toggleDrawer(true)}
              className="capitalize bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]"
            >
              {userName}
            </button>
          ) : (
            <Link to="/login">
              <button className='bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]'>
                Login
              </button>
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
          <h2 className="text-4xl font-bold mb-4">Your Career, Just a <strong className='text-customm'>Node</strong> Away</h2>
          <p className="mb-6 text-gray-600">
          JobNode connects job seekers with employers quickly and easily. It’s a platform designed to make finding jobs or hiring talent simple and straightforward. Whether you're looking for work or hiring, JobNode helps you get it done.
          </p>
          <Link
            to="/posts"
            className="bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]"
          >
            Explore Posts
          </Link>
        </div>
        <div className="md:w-1/3">
          <img
            // src="https://placehold.co/600x400"
            src="./imageHome.jpg"
            alt="Innovative Technology"
            className="rounded-md shadow-md"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-semibold text-center mb-6">About Us</h2>
        <p className="text-center text-gray-600">
        At JobNode, we believe in simplifying the way people find jobs and companies hire talent. Our platform is built to connect job seekers and employers in a seamless, efficient, and transparent way. Whether you're looking for your next career opportunity or the perfect addition to your team, JobNode is here to make the process simple and stress-free. We are committed to creating a network where talent and opportunity meet, driving growth and success for everyone involved. At JobNode, your future is our priority.
        </p>
      </section>

      {/* Services Section */}
      <section className="container mx-auto py-12">
  <h2 className="text-3xl font-semibold text-center mb-6">Services</h2>
  <div className="flex gap-6 overflow-x-auto px-4">
    {[
      {
        title: "Posts",
        description: "Explore job posts and find the perfect opportunity tailored to your skills.",
        icon: "📝",
        link: "/posts",
      },
      {
        title: "Applications",
        description: "Manage your job applications efficiently and stay organized.",
        icon: "📄",
        link: "/applications",
      },
      {
        title: "Chats",
        description: "Connect with employers or candidates instantly via our chat feature.",
        icon: "💬",
        link: "/chats",
      },
    ].map((service, index) => (
      <div
        key={index}
        className="bg-white min-w-[300px] p-6 rounded-md shadow-md border border-gray-200 flex flex-col items-center text-center"
      >
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <Link
          to={service.link}
          className="bg-customm text-white py-2 px-4 rounded-md hover:bg-[rgba(62,7,181,1)]"
        >
          Explore
        </Link>
      </div>
    ))}
  </div>
</section>


      {/* Footer */}
      <footer className="bg-customm text-white text-center py-4">
        <p>© {new Date().getFullYear()} JobNode. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
