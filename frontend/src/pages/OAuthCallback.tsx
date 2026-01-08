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
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:7004';
          const response = await fetch(`${apiBaseUrl}/api/auth/google/exchange/`, {
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
            const errorData = await response.json().catch(() => ({}));
            console.error('Server error:', {
              status: response.status,
              statusText: response.statusText,
              detail: errorData.detail,
              redirectUri: redirectUri,
              apiBaseUrl: apiBaseUrl,
            });
            throw new Error(`Token exchange failed: ${errorData.detail || response.statusText}`);
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
        <p className="mt-2 text-sm text-gray-500">This may take a moment...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;