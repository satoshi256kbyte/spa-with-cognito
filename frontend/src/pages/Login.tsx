import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const AuthenticatedContent = () => {
  const { user, signOut } = useAuthenticator(context => [context.user]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/member');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h2>ログイン成功！</h2>
      <p>ユーザー: {user?.username}</p>
      <p>リダイレクトします...</p>
      <button
        onClick={signOut}
        style={{
          padding: '8px 16px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        ログアウト
      </button>
    </div>
  );
};

const Login: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        marginTop: '50px',
      }}
    >
      <h1>ログイン / 新規登録</h1>
      <Authenticator
        initialState="signIn"
        services={{
          handleSignUp: async formData => {
            return {
              isSignUpComplete: false,
              nextStep: {
                signUpStep: 'CONFIRM_SIGN_UP',
                codeDeliveryDetails: {
                  deliveryMedium: 'EMAIL',
                  destination: formData.username,
                  attributeName: 'email',
                },
              },
            };
          },
        }}
      >
        {() => <AuthenticatedContent />}
      </Authenticator>
    </div>
  );
};

export default Login;
