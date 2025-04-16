import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Member from './pages/Member';
import Navigation from './components/Navigation';

// AWS Amplify Authentication
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ユーザーの認証状態を確認する関数
  const checkAuthState = async () => {
    try {
      const session = await fetchAuthSession();
      setIsLoggedIn(!!session.tokens);
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
      {({ signOut, user }) => (
        <div className="app">
          <Navigation 
            isLoggedIn={!!user} 
            onSignIn={() => {}} // Amplifyが処理するため空の関数
            onSignOut={signOut} 
          />
          <main>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    isLoggedIn={!!user} 
                    onSignIn={() => {}} // Amplifyが処理するため空の関数
                    onSignOut={signOut} 
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
      )}
    </Authenticator>
  );
};

export default App;
