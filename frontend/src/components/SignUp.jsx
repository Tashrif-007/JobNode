import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    userType: 'JobSeeker',
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
      const response = await fetch("http://localhost:3500/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registration failed");
      }

      alert("Registration successful!");
      setFormData({
        email: '',
        name: '',
        password: '',
        userType: 'JobSeeker',
      });
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.message);
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
      <div className='flex bg-white shadow-lg rounded-lg overflow-hidden w-[40em]'>
        <form
          className='flex flex-col gap-4 w-1/2 p-8'
          onSubmit={handleSubmit}
        >
          <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>SignUp</h1>
          <TextField
            id='signup-email'
            label='Email'
            variant='outlined'
            onChange={handleChange}
            type='email'
            name='email'
            value={formData.email}
          />
          <TextField
            id='signup-username'
            label='Username'
            variant='outlined'
            onChange={handleChange}
            type='text'
            name='name'
            value={formData.name}
          />
          <TextField
            id='signup-password'
            label='Password'
            variant='outlined'
            onChange={handleChange}
            type='password'
            name='password'
            value={formData.password}
          />
          <FormControl fullWidth>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="user-type"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="User Type"
            >
              <MenuItem value="JobSeeker">Job Seeker</MenuItem>
              <MenuItem value="Company">Company</MenuItem>
            </Select>
          </FormControl>

          {error && <p className='text-red-500 text-center'>{error}</p>}
          <ColorButton
            variant='contained'
            size='large'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'SignUp'}
          </ColorButton>
          <div className='flex items-center gap-2 text-sm mt-4'>
            <div className='w-full h-[1px] bg-gray-300'></div>
          </div>
          <p className='text-sm text-center mt-4'>
            Already have an account?{' '}
             <Link to='/login' className='text-blue-500 hover:underline'>
              Login
            </Link> 
          </p>
        </form>

        <div className='w-1/2 bg-gray-200 flex items-center justify-center'>
          <img src='/path-to-signup-image.png' alt='Illustration' className='w-3/4 h-auto' />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
