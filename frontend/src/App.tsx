import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Member from './pages/Member';
import Navigation from './components/Navigation';

// AWS Amplify Authentication
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';  // Using traditional import style for v5

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ユーザーの認証状態を確認する関数
  const checkAuthState = async () => {
    try {
      const session = await Auth.currentSession();
      setIsLoggedIn(!!session);
    } catch (error) {
      console.log('Not authenticated', error);
      setIsLoggedIn(false);
    }
  };

  // コンポーネントマウント時に認証状態をチェック
  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const handleSignOut = () => {
          if (signOut) signOut();
        };
        
        return (
          <div className="app">
            <Navigation 
              isLoggedIn={!!user} 
              onSignIn={() => {}}
              onSignOut={handleSignOut}
            />
            <main>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Home 
                      isLoggedIn={!!user} 
                      onSignIn={() => {}}
                      onSignOut={handleSignOut}
                    />
                  } 
                />
                <Route path="/about" element={<About />} />
                <Route 
                  path="/member" 
                  element={<Member isLoggedIn={!!user} />} 
                />
              </Routes>
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
};

export default App;
