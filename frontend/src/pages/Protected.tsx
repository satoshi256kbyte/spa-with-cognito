import React, { useState, useEffect } from 'react';
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import { API, Auth } from 'aws-amplify';

const Protected: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { route } = useAuthenticator(context => [context.route]);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the protected API endpoint
      const response = await API.get('mainApi', 'protected', {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      });

      setData(response);
    } catch (err: any) {
      console.error('Error fetching protected data:', err);
      setError(err.message || 'データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>保護されたページ</h1>
      <p>このページはCognitoで認証されたユーザーのみがアクセスできます。</p>

      <Authenticator>
        {() => (
          <div>
            <p>認証に成功しました！</p>

            <div style={{ marginTop: '20px' }}>
              <h2>保護されたAPIからのデータ</h2>

              <button
                onClick={fetchProtectedData}
                disabled={loading}
                style={{
                  padding: '8px 15px',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'ロード中...' : 'データを取得する'}
              </button>

              {error && <div style={{ color: 'red', marginTop: '10px' }}>エラー: {error}</div>}

              {data && (
                <div
                  style={{
                    marginTop: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                >
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </Authenticator>
    </div>
  );
};

export default Protected;
