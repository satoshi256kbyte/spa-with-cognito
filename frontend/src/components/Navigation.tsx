import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isLoggedIn, onSignIn, onSignOut }) => {
  const location = useLocation();

  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
        <li>
          <Link to="/" style={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}>
            ホーム
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            style={{ fontWeight: location.pathname === '/about' ? 'bold' : 'normal' }}
          >
            About
          </Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link
              to="/member"
              style={{ fontWeight: location.pathname === '/member' ? 'bold' : 'normal' }}
            >
              Member
            </Link>
          </li>
        )}
        <li style={{ marginLeft: 'auto' }}>
          {isLoggedIn ? (
            <button
              onClick={onSignOut}
              style={{
                padding: '5px 10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={onSignIn}
              style={{
                padding: '5px 10px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
