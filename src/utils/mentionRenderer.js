/**
 * Renderiza texto com menções destacadas (azul e sublinhado)
 * @param {string} text - Texto com menções
 * @param {function} onUserClick - Callback quando clicar no nome (opcional)
 * @returns {Array} Array de elementos React ou string
 */
export function renderTextWithMentions(text, onUserClick = null) {
  if (!text || typeof text !== 'string') return text;
  
  // Regex para encontrar @username ou @Nome Completo
  const mentionRegex = /@([a-zA-Z0-9_\-]+(?:\s+[a-zA-Z0-9_\-]+)*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    // Adicionar texto antes da menção
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Adicionar menção destacada
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
  
  // Adicionar texto restante
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  // Se não encontrou menções, retornar texto original
  if (parts.length === 0) return text;
  
  return parts;
}

