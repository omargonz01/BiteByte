import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../backend/config/firebaseClient';
import './Profile.css';

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1 className="profile-title">Profile</h1>
        {isAuthenticated ? (
          <div>
            <h2 className="profile-subtitle">Welcome, {auth.currentUser.email}</h2>
            {/* Display user profile information and additional options */}
          </div>
        ) : (
          <div>
            <h2 className="profile-subtitle">Sign In to Access Full Features</h2>
            <p className="profile-description">
              Manage your profile settings and personal information! 🕵🏽‍♂️
            </p>
            <div className="profile-button-group">
              <button className="profile-button" onClick={handleSignIn}>Sign In</button>
              <button className="profile-button" onClick={handleSignUp}>Sign Up</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
