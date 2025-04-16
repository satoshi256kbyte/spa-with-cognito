import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api-config';

interface HomeProps {
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

interface GuestApiResponse {
  message: string;
  data?: any;
}

interface MemberApiResponse {
  message: string;
  data?: any;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, onSignIn, onSignOut }) => {
  const [guestData, setGuestData] = useState<GuestApiResponse | null>(null);
  const [guestLoading, setGuestLoading] = useState<boolean>(true);
  const [guestError, setGuestError] = useState<string | null>(null);

  const [memberData, setMemberData] = useState<MemberApiResponse | null>(null);
  const [memberLoading, setMemberLoading] = useState<boolean>(true);
  const [memberError, setMemberError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        setGuestLoading(true);
        const response = await fetch(apiConfig.endpoints.guest);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: GuestApiResponse = await response.json();
        setGuestData(data);
        setGuestError(null);
      } catch (err) {
        console.error('Error fetching guest data:', err);
        setGuestError('ゲストデータの取得に失敗しました。しばらく経ってからお試しください。');
      } finally {
        setGuestLoading(false);
      }
    };

    fetchGuestData();
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!isLoggedIn) {
        setMemberLoading(false);
        setMemberError('API認証エラー: サインインが必要です。');
        return;
      }

      try {
        console.info('HTTP API endpoint started');
        setMemberLoading(true);
        
        // Amplifyから現在のセッション情報を取得する
        const { Auth } = await import('aws-amplify');
        
        try {
          const session = await Auth.currentSession();
          const token = session.getIdToken().getJwtToken();
          
          if (!token) {
            throw new Error('No token available');
          }

          console.info('Token obtained from Amplify:', token ? 'Valid token' : 'No token');
          
          const response = await fetch(apiConfig.endpoints.member, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.info(response);

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const data: MemberApiResponse = await response.json();
          setMemberData(data);
          setMemberError(null);

          console.info('HTTP API endpoint succeeded');
        } catch (authError) {
          console.error('Authentication error:', authError);
          setMemberError('認証エラーが発生しました。再度ログインしてください。');
        }
      } catch (err) {
        console.error('Error fetching member data:', err);
        setMemberError('メンバーデータの取得に失敗しました。しばらく経ってからお試しください。');
      } finally {
        setMemberLoading(false);
      }
    };

    fetchMemberData();
  }, [isLoggedIn]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>TOPページ</h1>
      <p>このアプリケーションはシンプルな画面遷移を実装したシングルページアプリケーションです。</p>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px',
        }}
      >
        <h2>ゲストAPI データ</h2>
        {guestLoading ? (
          <p>データを読み込み中です...</p>
        ) : guestError ? (
          <p style={{ color: 'red' }}>{guestError}</p>
        ) : (
          <div>
            <p>{guestData?.message}</p>
            {guestData?.data && (
              <pre
                style={{
                  background: '#eee',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(guestData.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f0f4ff',
          borderRadius: '5px',
        }}
      >
        <h2>メンバーAPI データ</h2>
        {memberLoading ? (
          <p>データを読み込み中です...</p>
        ) : memberError ? (
          <div>
            <p style={{ color: 'red' }}>{memberError}</p>
            {!isLoggedIn && (
              <p style={{ fontStyle: 'italic' }}>
                ↑このエラーは意図的に表示されています。メンバーコンテンツを表示するにはログインが必要です。
              </p>
            )}
          </div>
        ) : (
          <div>
            <p>{memberData?.message}</p>
            {memberData?.data && (
              <pre
                style={{
                  background: '#eee',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(memberData.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

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
