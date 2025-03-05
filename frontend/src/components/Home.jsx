import Navbar from './Navbar';
import AppDrawer from './AppDrawer';
import Footer from './Footer';
import Services from './Services';
import About from './About';
import Hero from './Hero';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <Navbar toggleDrawer={toggleDrawer} />
      <div style={{paddingTop: '80px'}}>
      <Hero />
      <About />
      <Services />
      </div>
      <Footer />
    </div>
  );
};

export default Home;