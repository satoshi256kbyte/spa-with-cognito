import React from 'react';
import { Navigate } from 'react-router-dom';

interface MemberProps {
  isLoggedIn: boolean;
}

const Member: React.FC<MemberProps> = ({ isLoggedIn }) => {
  // ログインしていない場合はトップページにリダイレクト
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Member ページ</h1>
      <p>このページはログインが必要です。</p>
      <p>ログイン済みユーザー向けの特別なコンテンツが表示されます。</p>
    </div>
  );
};

export default Member;