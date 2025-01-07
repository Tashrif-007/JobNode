import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import "react-toastify/dist/ReactToastify.css"; // Import the default styles for toast notifications
import ApplyPage from './pages/Apply';
import Applications from './pages/Applications';

const App = () => {
  return (
    // <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/posts' element={<Posts />}/>
          <Route path='/applications' element={<Applications />}/>
          <Route path='/posts/apply/:id' element={<ApplyPage />}/>
          <Route path='/create-post' element={<CreatePost />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/reset-password' element={<ResetPassword />}/>
        </Routes>
      </div>
    // </Router>
  );
};

export default App;
