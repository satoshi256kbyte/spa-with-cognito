import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Amplify設定をインポート
import { Amplify } from 'aws-amplify';
import awsExports from './config/aws-exports';

// Amplifyクライアントを設定
Amplify.configure({ ...awsExports });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
