import React, { useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../backend/config/firebaseClient';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Snackbar, CircularProgress, Alert, Divider } from '@mui/material';
import './SignIn.css';

const GoogleButton = ({ open, onClick }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signIn = async () => {
    try {
      await signInWithGoogle();
      localStorage.setItem('auth', 'true');
      onAuthStateChanged(auth, (user) => {
        if (user) {
          localStorage.setItem('user', user.email || '');
          localStorage.setItem('uuid', user.uid || '');
          setMessage(`Successfully logged in as ${user.email}`);
          setMessageType('success');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error("Google Sign-in error:", error);
      setMessage(error.message);
      setMessageType('error');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Button
        variant="contained"
        size="medium"
        className="auth-button"
        onClick={signIn}
        style={{ backgroundColor: '#5A6D57', color: '#fff' }}
      >
        Sign In With Google
      </Button>
      <Snackbar open={open} autoHideDuration={2000} onClose={onClick}>
        <Alert severity={messageType}>{message}</Alert>
      </Snackbar>
    </Box>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      localStorage.setItem('auth', 'true');
      onAuthStateChanged(auth, (user) => {
        if (user) {
          localStorage.setItem('user', user.email || '');
          localStorage.setItem('uuid', user.uid || '');
          setMessage(`Successfully logged in as ${user.email}`);
          setMessageType('success');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <Box className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <Typography variant="h6">Sign Into Your Account</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <input {...register('email')} placeholder="Email Here" className="auth-input" />
          <input {...register('password')} type="password" placeholder="Password must be 6 characters or longer" className="auth-input" />
        </Box>
        <Button
          variant="contained"
          size="large"
          type="submit"
          className="auth-button"
          style={{ backgroundColor: '#5A6D57', color: '#fff' }}
        >
          Sign In
        </Button>
        <Divider className="auth-divider">OR</Divider>
        <GoogleButton open={!!message} onClick={() => setMessage('')} />
        <Button variant="text" color="success" onClick={handleSignUp} className="auth-link">
          Don't have an account? Sign Up
        </Button>
      </form>
      <Snackbar open={!!message} autoHideDuration={2000} onClose={() => setMessage('')}>
        <Alert severity={messageType}>{message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SignIn;
