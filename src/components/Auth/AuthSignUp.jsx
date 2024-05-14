import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../backend/config/firebaseClient';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      localStorage.setItem('auth', 'true');
      setMessage('Successfully signed up!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <Box className="signup-container">
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <Typography variant="h6">Create a New Account</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <input {...register('email')} placeholder="Email Here" className="signup-input" />
          <input {...register('password')} type="password" placeholder="Password must be 6 characters or longer" className="signup-input" />
        </Box>
        <Button
          variant="contained"
          size="large"
          type="submit"
          className="signup-button"
          style={{ backgroundColor: '#5A6D57', color: '#fff' }}
        >
          Sign Up
        </Button>
        <Button variant="text" color="success" onClick={handleSignIn} className="signup-link">
          Already have an account? Sign In
        </Button>
      </form>
      <Snackbar open={!!message} autoHideDuration={2000} onClose={() => setMessage('')}>
        <Alert severity={messageType}>{message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;
