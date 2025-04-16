import React from 'react';

interface HomeProps {
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, onSignIn, onSignOut }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>SPA - ホームページ</h1>
      <p>
        このアプリケーションはシンプルな画面遷移を実装したシングルページアプリケーションです。
      </p>

      {isLoggedIn ? (
        <div style={{ marginTop: '20px' }}>
          <h2>ログイン済みコンテンツ</h2>
          <p>ログイン状態です。Member ページにアクセスできます。</p>
          <button
            onClick={onSignOut}
            style={{
              marginTop: '10px',
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
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h2>未ログインコンテンツ</h2>
          <p>ログインするとさらに多くの機能にアクセスできます。</p>
          <button
            onClick={onSignIn}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ログイン
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
