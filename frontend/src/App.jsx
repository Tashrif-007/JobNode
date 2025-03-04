import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import "react-toastify/dist/ReactToastify.css"; 
import ApplyPage from './pages/Apply';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import RecommendedPosts from './pages/Recommend';
import JobOffers from './pages/Offer';

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
          <Route path='/chats' element={<Chat/>}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/reset-password' element={<ResetPassword />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/recommendations' element={<RecommendedPosts />}/>
          <Route path='/offer' element={<JobOffers />}/>
        </Routes>
      </div>
    // </Router>
  );
};

export default App;
