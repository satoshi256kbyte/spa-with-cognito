import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Home from './pages/Home';
import Protected from './pages/Protected';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <Authenticator.Provider>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/protected" element={<Protected />} />
          </Routes>
        </main>
      </div>
    </Authenticator.Provider>
  );
};

export default App;