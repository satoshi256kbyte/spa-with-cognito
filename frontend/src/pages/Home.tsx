import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>SPA with Cognito - ホームページ</h1>
      <p>このアプリケーションはAWS Cognitoを使用した認証機能を持つシングルページアプリケーションです。</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>認証が必要なコンテンツ</h2>
        <Authenticator>
          {({ signOut }) => (
            <div>
              <p>ログインに成功しました！このコンテンツは認証済みユーザーのみ閲覧できます。</p>
              <button 
                onClick={signOut}
                style={{ 
                  marginTop: '10px',
                  padding: '5px 10px', 
                  background: '#f44336', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ログアウト
              </button>
            </div>
          )}
        </Authenticator>
      </div>
    </div>
  );
};

export default Home;