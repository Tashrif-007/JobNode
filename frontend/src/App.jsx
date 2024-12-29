import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Posts from './pages/Posts';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/posts' element={<Posts />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
