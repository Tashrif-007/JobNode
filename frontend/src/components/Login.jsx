




// Login Page
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    backgroundColor: '#1f68de',
    '&:hover': {
      backgroundColor: '#1955b5',
    },
  }));

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form
        className='flex flex-col gap-4 glassStyle w-[20em] border-4 border-blue-500 rounded p-4'
        onSubmit={handleSubmit}
      >
        <h1 className='text-center text-blue-700 text-[32px]'>Login</h1>
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
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <ColorButton variant='contained' size='large' type='submit' disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </ColorButton>
        <div className='flex justify-between'>
          <p>Don&apos;t have an account?</p>
          <Link to='/signup' className='text-blue-700'>Signup</Link>
        </div>
        <div className='flex justify-between'>
          <p>Forgot Password?</p>
          <Link to='/forgot-password' className='text-blue-700'>Reset Password</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
