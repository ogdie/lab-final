export function renderTextWithMentions(text, onUserClick = null) {
  if (!text || typeof text !== 'string') return text;
  
  const mentionRegex = /@([a-zA-Z0-9_\-]+(?:\s+[a-zA-Z0-9_\-]+)*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const mentionText = match[0];
    const userName = match[1];
    
    if (onUserClick) {
      parts.push(
        <span
          key={`mention-${match.index}`}
          style={{
            color: '#1877f2',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onClick={(e) => {
            e.preventDefault();
            onUserClick(userName);
          }}
        >
          {mentionText}
        </span>
      );
    } else {
      parts.push(
        <span
          key={`mention-${match.index}`}
          style={{
            color: '#1877f2',
            textDecoration: 'underline',
            fontWeight: '500'
          }}
        >
          {mentionText}
        </span>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  if (parts.length === 0) return text;
  
  return parts;
}