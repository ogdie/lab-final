const API_URL = typeof window !== 'undefined' ? '/api' : 'http://localhost:3000/api';

const fetchAPI = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const fullUrl = `${API_URL}${url}`;
  const response = await fetch(fullUrl, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      error = { error: 'Erro ao fazer requisição' };
    }
    const message = error.error || 'Erro ao fazer requisição';
    const details = `status=${response.status} url=${fullUrl}`;
    throw new Error(`${message} (${details})`);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  register: (data) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  login: (data) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  logout: () => fetchAPI('/auth/logout', {
    method: 'POST'
  }),
  
  // OAuth login URLs
  getGoogleLoginUrl: () => `${API_URL}/auth/google`,
  getGitHubLoginUrl: () => `${API_URL}/auth/github`
};

// Users API
export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  getById: (id) => fetchAPI(`/users/${id}`),
  searchUsers: (name) => fetchAPI(`/users/search?name=${encodeURIComponent(name)}`),
  update: (id, data) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
  updateSettings: (id, data) => fetchAPI(`/users/${id}/settings`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  editProfile: (id, data) => fetchAPI(`/users/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getFollowers: (id) => fetchAPI(`/users/${id}/followers`),
  getFollowing: (id) => fetchAPI(`/users/${id}/following`),
  getConnections: (id) => fetchAPI(`/users/${id}/connections`),
  getUserPosts: (id) => fetchAPI(`/users/${id}/posts`),
  getNotifications: (id) => fetchAPI(`/users/${id}/notifications`)
};

// Follow API
usersAPI.toggleFollow = (targetUserId, followerId) => fetchAPI(`/users/${targetUserId}/follow`, {
  method: 'POST',
  body: JSON.stringify({ followerId })
});

// Posts API
export const postsAPI = {
  getAll: () => fetchAPI('/posts'),
  getById: (id) => fetchAPI(`/posts/${id}`),
  create: (data) => fetchAPI('/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchAPI(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchAPI(`/posts/${id}`, { method: 'DELETE' }),
  like: (id, userId) => fetchAPI(`/posts/${id}/like`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  }),
  addComment: (id, data) => fetchAPI(`/posts/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getComments: (id) => fetchAPI(`/posts/${id}/comments`)
};

// Comments API
export const commentsAPI = {
  getAll: () => fetchAPI('/comments'),
  getById: (id) => fetchAPI(`/comments/${id}`),
  update: (id, data) => fetchAPI(`/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchAPI(`/comments/${id}`, { method: 'DELETE' })
};

// Notifications API
export const notificationsAPI = {
  getAll: (userId) => fetchAPI(`/notifications${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),
  markAsRead: (id) => fetchAPI(`/notifications/${id}/read`, {
    method: 'PUT'
  }),
  delete: (id) => fetchAPI(`/notifications/${id}`, { method: 'DELETE' })
};

// Ranking API
export const rankingAPI = {
  getRanking: () => fetchAPI('/ranking')
};

// Forum API
export const forumAPI = {
  getTopics: () => fetchAPI('/forum/topics'),
  createTopic: (data) => fetchAPI('/forum/topics', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getTopic: (id) => fetchAPI(`/forum/topics/${id}`),
  addReply: (id, data) => fetchAPI(`/forum/topics/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Chat API
export const chatAPI = {
  getConversations: (userId) => fetchAPI(`/chat?userId=${userId}`),
  getMessages: (userId, currentUserId) => fetchAPI(`/chat/${userId}/messages?currentUserId=${currentUserId}`),
  sendMessage: (userId, data) => fetchAPI(`/chat/${userId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteConversation: (userId, currentUserId) => fetchAPI(`/chat/${userId}?currentUserId=${currentUserId}`, {
    method: 'DELETE'
  })
};

// Connections API
export const connectionsAPI = {
  sendRequest: (id, from) => fetchAPI(`/connections/${id}/request`, {
    method: 'POST',
    body: JSON.stringify({ from })
  }),
  accept: (id) => fetchAPI(`/connections/${id}/accept`, {
    method: 'PUT'
  }),
  decline: (id) => fetchAPI(`/connections/${id}/decline`, {
    method: 'PUT'
  }),
  getReceived: (userId) => fetchAPI(`/connections/requests?userId=${userId}`),
  getSent: (userId) => fetchAPI(`/connections/sent?userId=${userId}`),
  remove: (id, currentUserId) => fetchAPI(`/connections/${id}?currentUserId=${currentUserId}`, {
    method: 'DELETE'
  })
};

// Search API
export const searchAPI = {
  search: (query) => fetchAPI(`/search?query=${query}`)
};

