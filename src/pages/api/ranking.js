const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function handler(req, res) {
  try {
    const url = `${BASE_URL}/api/ranking`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

