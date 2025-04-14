import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { route, signOut } = useAuthenticator(context => [context.route, context.signOut]);

  const isAuthenticated = route === 'authenticated';

  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
        <li>
          <Link to="/" style={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}>
            ホーム
          </Link>
        </li>
        <li>
          <Link
            to="/protected"
            style={{ fontWeight: location.pathname === '/protected' ? 'bold' : 'normal' }}
          >
            保護されたページ
          </Link>
        </li>
        {isAuthenticated ? (
          <li style={{ marginLeft: 'auto' }}>
            <button
              onClick={signOut}
              style={{
                padding: '5px 10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ログアウト
            </button>
          </li>
        ) : (
          <li style={{ marginLeft: 'auto' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                padding: '5px 10px',
                background: '#4CAF50',
                color: 'white',
                borderRadius: '4px',
              }}
            >
              ログイン
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
