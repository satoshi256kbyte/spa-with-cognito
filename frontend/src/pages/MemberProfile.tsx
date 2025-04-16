import React from 'react';

const MemberProfile: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>プロフィールページ</h1>
      <p>こちらはメンバー専用のプロフィールページです。</p>
      <p>このページはログインが必要です。</p>
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h3>ユーザー情報</h3>
        <p>名前: 山田 太郎</p>
        <p>メール: example@example.com</p>
        <p>会員登録日: 2025年1月15日</p>
      </div>
    </div>
  );
};

export default MemberProfile;
