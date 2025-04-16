import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Member from './pages/Member';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

import { Auth, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkAuthState = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsLoggedIn(true);
    } catch (error) {
      console.log('Not authenticated', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuthState();

    const listener = Hub.listen('auth', (data: { payload: { event: string } }) => {
      switch (data.payload.event) {
        case 'signIn':
          checkAuthState();
          break;
        case 'signOut':
          setIsLoggedIn(false);
          break;
      }
    });

    return () => listener();
  }, []);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  return (
    <div className="app">
      <Navigation isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onSignOut={handleSignOut} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onSignOut={handleSignOut} />
            }
          />
          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/member/*"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Member isLoggedIn={isLoggedIn} />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
