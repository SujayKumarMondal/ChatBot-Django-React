import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithTokens } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/signin');
      return;
    }

    if (code) {
      // Exchange the authorization code for tokens
      const exchangeTokens = async () => {
        try {
          const redirectUri = `${window.location.origin}/oauth-callback`;
          const response = await fetch('http://127.0.0.1:7004/api/auth/google/exchange/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              redirect_uri: redirectUri,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to exchange tokens');
          }

          const data = await response.json();
          signInWithTokens(data.access, data.refresh, data.user);
          navigate('/');
        } catch (err) {
          console.error('Token exchange failed:', err);
          navigate('/signin');
        }
      };

      exchangeTokens();
    } else {
      navigate('/signin');
    }
  }, [searchParams, navigate, signInWithTokens]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Processing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;