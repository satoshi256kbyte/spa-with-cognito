import React from 'react';

const MemberSettings: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>設定ページ</h1>
      <p>こちらはメンバー専用の設定ページです。</p>
      <p>このページはログインが必要です。</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>アカウント設定</h3>
        <form style={{ maxWidth: '400px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>メールアドレス通知</label>
            <select style={{ width: '100%', padding: '8px' }}>
              <option value="daily">毎日</option>
              <option value="weekly">週1回</option>
              <option value="monthly">月1回</option>
              <option value="none">通知しない</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>テーマ</label>
            <div>
              <input type="radio" id="light" name="theme" value="light" defaultChecked />
              <label htmlFor="light" style={{ marginLeft: '5px', marginRight: '15px' }}>ライト</label>
              
              <input type="radio" id="dark" name="theme" value="dark" />
              <label htmlFor="dark" style={{ marginLeft: '5px' }}>ダーク</label>
            </div>
          </div>
          
          <button 
            type="button" 
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            設定を保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberSettings;