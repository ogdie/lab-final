import { useState, useEffect, useRef } from 'react';
import { usersAPI } from '../../services/api';

export default function MentionAutocomplete({ 
  text, 
  cursorPosition, 
  onSelectUser, 
  onClose,
  containerRef,
  theme = 'light'
}) {
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const hoverBg = isDark ? '#3a3b3c' : '#f0f2f5';

  const getMentionQuery = () => {
    if (!text || cursorPosition === null) return '';
    const textBeforeCursor = text.substring(0, cursorPosition);
    const match = textBeforeCursor.match(/@([a-zA-Z0-9_\-\s]*)$/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    const query = getMentionQuery();
    
    if (!query || query.length < 1) {
      setUsers([]);
      if (query === '') onClose();
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const results = await usersAPI.searchUsers(query);
        setUsers(Array.isArray(results) ? results.slice(0, 5) : []); // Limitar a 5 resultados
        setSelectedIndex(0);
      } catch (err) {
        console.error('Error searching users:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 200);
    return () => clearTimeout(debounceTimer);
  }, [text, cursorPosition]);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (user) => {
    const query = getMentionQuery();
    const beforeMention = text.substring(0, cursorPosition - query.length - 1);
    const afterMention = text.substring(cursorPosition);
    const newText = `${beforeMention}@${user.name} ${afterMention}`;
    onSelectUser(newText, beforeMention.length + user.name.length + 2); // +2 para @ e espaço
    setUsers([]);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (users.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < users.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && users[selectedIndex]) {
      e.preventDefault();
      handleSelect(users[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setUsers([]);
      onClose();
    }
  };

  useEffect(() => {
    if (users.length === 0) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [users, selectedIndex]);

  if (users.length === 0 || !containerRef?.current) return null;

  return (
    <div
      ref={listRef}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: '4px',
        background: backgroundCard,
        border: `1px solid ${borderSubtle}`,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '300px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}
    >
      {users.map((user, index) => (
        <div
          key={user._id}
          onClick={() => handleSelect(user)}
          style={{
            padding: '10px 12px',
            cursor: 'pointer',
            background: index === selectedIndex ? hoverBg : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: index < users.length - 1 ? `1px solid ${borderSubtle}` : 'none'
          }}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <img
            src={user.profilePicture || '/default-avatar.svg'}
            alt={user.name}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: textPrimary }}>
              {user.name}
            </div>
            {user.email && (
              <div style={{ fontSize: '0.8rem', color: isDark ? '#b0b3b8' : '#666' }}>
                {user.email}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}