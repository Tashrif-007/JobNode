import { useState } from 'react';
import { TextField, Button } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3500/auth/sendResetMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError('');
            } else {
                setError(data.message || 'Something went wrong');
                setMessage('');
            }
        } catch (err) {
            console.log(err.message);
            setError('Something went wrong. Please try again later.');
            setMessage('');
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <form
                className='flex flex-col gap-4 glassStyle w-[20em] border-4 border-blue-500 rounded p-4'
                onSubmit={handleSubmit}
            >
                <h1 className='text-center text-blue-700 text-[28px]'>Reset Password</h1>
                <TextField
                    id='outlined-basic'
                    label='Email'
                    variant='outlined'
                    onChange={handleChange}
                    type='email'
                    name='email'
                    value={email}
                    required
                />
                {message && <p className='text-green-500 text-center'>{message}</p>}
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <Button
                    variant='contained'
                    size='large'
                    type='submit'
                    className='bg-blue-500 hover:bg-blue-700 text-white'
                >
                    Send Reset Email
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword;
