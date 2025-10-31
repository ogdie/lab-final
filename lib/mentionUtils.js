import User from "../models/user.js";

/**
 * Extrai menções (@username ou @Nome Completo) de um texto
 * @param {string} text - Texto para analisar
 * @returns {Array<string>} - Array de nomes de usuários mencionados (sem o @)
 */
export function extractMentions(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Regex para encontrar @username ou @Nome Completo
  // Permite letras, números, underscores, hífens e espaços (mínimo 1 caractere)
  const mentionRegex = /@([a-zA-Z0-9_\-]+(?:\s+[a-zA-Z0-9_\-]+)*)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    const username = match[1].trim();
    // Evitar duplicatas e strings vazias
    if (username && !mentions.includes(username)) {
      mentions.push(username);
    }
  }
  
  return mentions;
}

/**
 * Processa menções em um texto e cria notificações
 * @param {string} text - Texto com menções
 * @param {string} fromUserId - ID do usuário que fez a menção
 * @param {string} relatedPostId - ID do post relacionado (opcional)
 * @param {string} relatedCommentId - ID do comentário relacionado (opcional)
 */
export async function processMentions(text, fromUserId, relatedPostId = null, relatedCommentId = null) {
  if (!text || !fromUserId) return;
  
  const mentions = extractMentions(text);
  if (mentions.length === 0) return;
  
  try {
    // Buscar usuários mencionados por nome (busca case-insensitive e flexível)
    // Remove espaços extras e busca por correspondência parcial ou exata
    const users = await User.find({
      $or: mentions.map(mention => {
        // Limpar espaços extras
        const cleanMention = mention.trim().replace(/\s+/g, ' ');
        // Escapar caracteres especiais para regex
        const escaped = cleanMention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return {
          name: { $regex: new RegExp(`^${escaped}$`, 'i') }
        };
      })
    }).limit(50); // Limitar para evitar muitos resultados
    
    // Criar notificações para cada usuário mencionado
    const Notification = (await import('../models/notification.js')).default;
    
    for (const user of users) {
      // Não criar notificação se o usuário mencionou a si mesmo
      if (user._id.toString() === fromUserId.toString()) continue;
      
      // Determinar se é menção em post ou comentário
      const mentionType = relatedCommentId ? 'comment' : 'post';
      
      // Criar notificação de menção com mensagem específica
      await Notification.create({
        user: user._id,
        from: fromUserId,
        type: 'mention',
        relatedPost: relatedPostId,
        relatedComment: relatedCommentId,
        mentionType: mentionType // Campo adicional para identificar tipo
      });
    }
  } catch (error) {
    console.error('Error processing mentions:', error);
    // Não lançar erro para não interromper o fluxo principal
  }
}
