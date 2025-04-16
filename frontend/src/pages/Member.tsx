import React from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import MemberProfile from './MemberProfile';
import MemberSettings from './MemberSettings';

interface MemberProps {
  isLoggedIn: boolean;
}

const Member: React.FC<MemberProps> = ({ isLoggedIn }) => {
  const location = useLocation();

  // ログインしていない場合はトップページにリダイレクト
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  const isRoot = location.pathname === '/member';
  const isProfile = location.pathname.includes('/member/profile');
  const isSettings = location.pathname.includes('/member/settings');

  return (
    <div style={{ padding: '20px' }}>
      {isRoot && (
        <>
          <h1>メンバーエリア</h1>
          <p>このページはログインが必要です。</p>
          <p>ログイン済みユーザー向けの特別なコンテンツが表示されます。</p>

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

      {/* サブページがリクエストされた場合は、子ルートを表示 */}
      {!isRoot && (
        <Routes>
          <Route path="profile" element={<MemberProfile />} />
          <Route path="settings" element={<MemberSettings />} />
        </Routes>
      )}

      {/* メンバーエリア内のナビゲーション */}
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
