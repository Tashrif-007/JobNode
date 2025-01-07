import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    userType: 'JobSeeker', // Default user type
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      console.error(error.message);
      setError(error.message);
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
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col gap-4 glassStyle w-[20em] border-4 border-blue-500 rounded p-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-blue-700 text-[32px]">SignUp</h1>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={handleChange}
          type="email"
          name="email"
          value={formData.email}
        />
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          onChange={handleChange}
          type="text"
          name="name"
          value={formData.name}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          onChange={handleChange}
          type="password"
          name="password"
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
          >
            <MenuItem value="JobSeeker">Job Seeker</MenuItem>
            <MenuItem value="Company">Company</MenuItem>
          </Select>
        </FormControl>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ColorButton variant="contained" size="large" type="submit">
          SignUp
        </ColorButton>
        <div className="flex justify-between">
          <p>Already have an account?</p>
          <Link to="/login" className="text-blue-700">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
