import User from "../models/user.js";

export function extractMentions(text) {
  if (!text || typeof text !== 'string') return [];
  
  const mentionRegex = /@([a-zA-Z0-9_\-]+(?:\s+[a-zA-Z0-9_\-]+)*)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    const username = match[1].trim();

    if (username && !mentions.includes(username)) {
      mentions.push(username);
    }
  }
  
  return mentions;
}

export async function processMentions(text, fromUserId, relatedPostId = null, relatedCommentId = null) {
  if (!text || !fromUserId) return;
  
  const mentions = extractMentions(text);
  if (mentions.length === 0) return;
  
  try {


    const users = await User.find({
      $or: mentions.map(mention => {

        const cleanMention = mention.trim().replace(/\s+/g, ' ');

        const escaped = cleanMention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return {
          name: { $regex: new RegExp(`^${escaped}$`, 'i') }
        };
      })
    }).limit(50);
    

    const Notification = (await import('../models/notification.js')).default;
    
    for (const user of users) {

      if (user._id.toString() === fromUserId.toString()) continue;
      

      const mentionType = relatedCommentId ? 'comment' : 'post';
      

      await Notification.create({
        user: user._id,
        from: fromUserId,
        type: 'mention',
        relatedPost: relatedPostId,
        relatedComment: relatedCommentId,
        mentionType: mentionType
      });
    }
  } catch (error) {
    console.error('Error processing mentions:', error);

  }
}
