import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Member from './pages/Member';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  // 簡易的なログイン状態管理（Cognitoの代わり）
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ログイン処理
  const handleSignIn = () => {
    setIsLoggedIn(true);
  };

  // ログアウト処理
  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        onSignIn={handleSignIn} 
        onSignOut={handleSignOut}
      />
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isLoggedIn={isLoggedIn} 
                onSignIn={handleSignIn} 
                onSignOut={handleSignOut}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route 
            path="/member" 
            element={<Member isLoggedIn={isLoggedIn} />} 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
