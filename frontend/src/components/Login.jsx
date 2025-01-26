import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3500/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to login");
      }

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      alert("Login Successful");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ColorButton = styled(Button)(() => ({
    color: '#FFFFFF',
    backgroundColor: '#6C63FF',
    '&:hover': {
      backgroundColor: '#514ACD',
    },
    borderRadius: '8px',
  }));

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='flex items-center bg-white shadow-lg rounded-lg overflow-hidden w-[40em]'>
        <form
          className='flex flex-col gap-4 w-1/2 p-8'
          onSubmit={handleSubmit}
        >
          <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>Login</h1>
          <TextField
            id='login-email'
            label='Email'
            variant='outlined'
            onChange={handleChange}
            type='email'
            name='email'
            value={formData.email}
          />
          <TextField
            id='login-password'
            label='Password'
            variant='outlined'
            onChange={handleChange}
            type='password'
            name='password'
            value={formData.password}
          />
          <Link to='/forgot-password' className='text-sm text-blue-500 hover:underline self-center'>
            Forgot Password?
          </Link>
          {error && <p className='text-red-500 text-center'>{error}</p>}
          <ColorButton
            variant='contained'
            size='large'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </ColorButton>
          <div className='flex items-center gap-2 text-sm mt-4'>
            <div className='w-full h-[1px] bg-gray-300'></div>
          </div>
          
          <p className='text-sm text-center mt-4'>
            Don’t have an account?{' '}
            <Link to='/signup' className='text-blue-500 hover:underline'>
              Register
            </Link>
          </p>
        </form>

        <div className='w-1/2 bg-gray-200 flex items-center justify-center'>
          <img src='/loginImg.jpeg' alt='Illustration' className='w-full h-auto' />
        </div>
      </div>
    </div>
  );
};

export default Login;
