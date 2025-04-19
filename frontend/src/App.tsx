import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Member from './pages/Member';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  // https://docs.amplify.aws/react/build-a-backend/auth/connect-your-frontend/manage-user-sessions/
  const checkAuthState = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      setIsLoggedIn(tokens !== undefined);
    } catch (error) {
      console.log('Not signed in');
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuthState();

    // https://docs.amplify.aws/gen1/javascript/build-a-backend/utilities/hub/
    const listener = Hub.listen('auth', (data: { payload: { event: string } }) => {
      checkAuthState();
    });

    return () => listener();
  }, []);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
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
