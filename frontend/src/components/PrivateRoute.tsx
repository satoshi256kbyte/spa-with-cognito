import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface PrivateRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isLoggedIn, children }) => {
  const location = useLocation();

  if (isLoggedIn) {
    // 既にログインしている場合は、子コンポーネントを表示
    return <>{children}</>;
  }

  // ログインしていない場合は、Authenticatorを表示
  return (
    <Authenticator>
      {({ signOut }) => {
        // 認証成功後、子コンポーネントを表示
        return <>{children}</>;
      }}
    </Authenticator>
  );
};

export default PrivateRoute;