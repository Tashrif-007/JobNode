import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [error,setError] = useState(null);

  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3500/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if(!response.ok) {
        throw new Error("Registration failed");
      }
      alert("reg done")
      setFormData({
        email: '',
        name: '',
        password: '',
      })
      setError(null);
      navigate("/login");

    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  }

  const ColorButton = styled(Button)(() => ({
    color: '#FFFFFF',
    backgroundColor: '#1f68de',
    '&:hover': {
        backgroundColor: '#1955b5',
    },
  }));

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form className='flex flex-col gap-4 glassStyle w-[20em] border-4 border-blue-500 rounded p-4' onSubmit={handleSubmit}>
          <h1 className='text-center text-blue-700 text-[32px]'>SignUp</h1>
          <TextField id='outlined-basic' label='Email' variant='outlined' onChange={handleChange} type='email' name='email' value={formData.email}/>
          <TextField id='outlined-basic' label='Username' variant='outlined' onChange={handleChange} type='text' name='name' value={formData.name}/>
          <TextField id='outlined-basic' label='Password' variant='outlined' onChange={handleChange} type='password' name='password' value={formData.password}/>
          {error && <p className='text-red-500 text-center'>{error}</p>}
          <ColorButton variant='contained' size='large' type='submit'>SignUp</ColorButton>
          <div className='flex justify-between'>
            <p>Already have account?</p>
            <Link to='/login' className='text-blue-700'>Login</Link>
          </div>
      </form>
    </div>
  )
}

export default SignUp