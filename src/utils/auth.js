// OAuth callback handler utility
export const handleOAuthCallback = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userString = urlParams.get('user');
  
  if (token && userString) {
    try {
      const user = JSON.parse(decodeURIComponent(userString));
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Clear URL parameters
      const url = new URL(window.location);
      url.searchParams.delete('token');
      url.searchParams.delete('user');
      window.history.replaceState({}, '', url.pathname + url.search);
      
      return { token, user };
    } catch (error) {
      console.error('Error parsing OAuth callback data:', error);
      return null;
    }
  }
  
  return null;
};

// Check for OAuth error in URL
export const checkOAuthError = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  
  if (error === 'oauth') {
    // Clear error parameter
    const url = new URL(window.location);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.pathname + url.search);
    
    return 'Erro na autenticação OAuth. Tente novamente.';
  }
  
  return null;
};

