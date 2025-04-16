import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api-config';

interface HomeProps {
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

// Define interface for the API response data
interface GuestApiResponse {
  message: string;
  data?: any;
  // Add other fields as needed based on your actual API response
}

interface MemberApiResponse {
  message: string;
  data?: any;
  // Add other fields as needed based on your actual API response
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, onSignIn, onSignOut }) => {
  // State for guest API data
  const [guestData, setGuestData] = useState<GuestApiResponse | null>(null);
  const [guestLoading, setGuestLoading] = useState<boolean>(true);
  const [guestError, setGuestError] = useState<string | null>(null);

  // State for member API data
  const [memberData, setMemberData] = useState<MemberApiResponse | null>(null);
  const [memberLoading, setMemberLoading] = useState<boolean>(true);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Fetch guest data when component mounts
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

  // Also try to fetch member data to show authentication error
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setMemberLoading(true);
        // Get authentication token - only available if logged in
        const token = localStorage.getItem('authToken');

        const response = await fetch(apiConfig.endpoints.member, {
          headers: {
            Authorization: `Bearer ${token || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: MemberApiResponse = await response.json();
        setMemberData(data);
        setMemberError(null);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setMemberError(
          'メンバーAPI認証エラー: メンバーデータにアクセスするにはログインが必要です。'
        );
      } finally {
        setMemberLoading(false);
      }
    };

    fetchMemberData();
  }, [isLoggedIn]); // Re-run when login status changes

  return (
    <div style={{ padding: '20px' }}>
      <h1>TOPページ</h1>
      <p>このアプリケーションはシンプルな画面遷移を実装したシングルページアプリケーションです。</p>

      {/* Guest API Data Display Section */}
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

      {/* Member API Data Display Section - Intentionally showing auth error for non-logged in users */}
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
