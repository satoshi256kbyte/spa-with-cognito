import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import MemberProfile from './MemberProfile';
import MemberSettings from './MemberSettings';
import apiConfig from '../config/api-config';

interface MemberProps {
  isLoggedIn: boolean;
}

interface MemberApiResponse {
  message: string;
  data?: any;
}

const Member: React.FC<MemberProps> = ({ isLoggedIn }) => {
  const location = useLocation();

  const [memberData, setMemberData] = useState<MemberApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isRoot = location.pathname === '/member';
  const isProfile = location.pathname.includes('/member/profile');
  const isSettings = location.pathname.includes('/member/settings');

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        // Amplifyから現在のセッション情報を取得する
        const { Auth } = await import('aws-amplify');
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        console.log('Token obtained from Amplify:', token ? 'Valid token' : 'No token');

        // メンバーAPIエンドポイントを使用する
        console.log('Using API endpoint...');
        const response = await fetch(apiConfig.endpoints.member, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: MemberApiResponse = await response.json();
        setMemberData(data);
        setError(null);
        console.log('HTTP API endpoint succeeded');
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError('メンバーデータの取得に失敗しました。しばらく経ってからお試しください。');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      {isRoot && (
        <>
          <h1>メンバーエリア</h1>
          <p>このページはログインが必要です。</p>
          <p>ログイン済みユーザー向けの特別なコンテンツが表示されます。</p>

          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
            }}
          >
            <h2>メンバーAPI データ</h2>
            {loading ? (
              <p>データを読み込み中です...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
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

          <div style={{ marginTop: '30px' }}>
            <h3>メンバーページ一覧</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link
                  to="/member/profile"
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    color: '#333',
                  }}
                >
                  プロフィール
                </Link>
              </li>
              <li>
                <Link
                  to="/member/settings"
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    color: '#333',
                  }}
                >
                  設定
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}

      {!isRoot && (
        <Routes>
          <Route path="profile" element={<MemberProfile />} />
          <Route path="settings" element={<MemberSettings />} />
        </Routes>
      )}

      {!isRoot && (
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <Link
            to="/member"
            style={{
              marginRight: '15px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: isRoot ? 'bold' : 'normal',
            }}
          >
            メンバーホーム
          </Link>
          <Link
            to="/member/profile"
            style={{
              marginRight: '15px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: isProfile ? 'bold' : 'normal',
            }}
          >
            プロフィール
          </Link>
          <Link
            to="/member/settings"
            style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: isSettings ? 'bold' : 'normal',
            }}
          >
            設定
          </Link>
        </div>
      )}
    </div>
  );
};

export default Member;
