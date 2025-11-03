export const handleOAuthCallback = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userString = urlParams.get('user');
  
  if (token && userString) {
    try {
      const user = JSON.parse(decodeURIComponent(userString));
      
      localStorage.setItem('token', token);
      
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

export const checkOAuthError = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  
  if (error === 'oauth') {
    const url = new URL(window.location);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.pathname + url.search);
    
    return 'Erro na autenticação OAuth. Tente novamente.';
  }
  
  return null;
};