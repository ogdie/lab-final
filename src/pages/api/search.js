const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function handler(req, res) {
  try {
    const { query, type } = req.query;
    
    let results = { posts: [], users: [] };
    
    // Search posts
    try {
      const postsResponse = await fetch(`${BASE_URL}/api/posts`);
      const posts = await postsResponse.json();
      results.posts = posts.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    } catch (err) {
      console.error('Error searching posts:', err);
    }
    
    // Search users
    try {
      const usersResponse = await fetch(`${BASE_URL}/api/users`);
      const users = await usersResponse.json();
      results.users = users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    } catch (err) {
      console.error('Error searching users:', err);
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

