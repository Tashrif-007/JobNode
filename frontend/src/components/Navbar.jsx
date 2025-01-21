// Navbar.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesData } from '../utils/servicesData';
const Navbar = ({ toggleDrawer }) => {
  const { user } = useAuth();
  const [userName, setUserName] = useState(null);

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
    <header className="container mx-auto py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        <img src="./logo.png" alt="Logo" className="w-8 h-auto inline-block mr-2" />
        JobNode
      </Link>
      <nav className="flex gap-5 items-center">
        <ul className="flex space-x-4">
          {servicesData.map((service)=> (
            <li key={service.title}>
                <Link to={service.link} className='hover:text-blue-500'>
                    {service.title}
                </Link>
            </li>
          ))}
          {/* <li>
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
          </li> */}

        </ul>
        {user ? (
          <button
            onClick={toggleDrawer(true)}
            className="capitalize bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]"
          >
            {userName || 'Loading...'}
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
  );
};

export default Navbar;