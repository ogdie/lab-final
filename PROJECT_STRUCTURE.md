# Estrutura Completa do Projeto CodeConnect

## 📊 Resumo de Endpoints

**Total: 48 endpoints REST**

### Autenticação (`/api/auth` e `/auth`) - 7 endpoints
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email e senha
- `POST /api/auth/logout` - Logout
- `GET /auth/google` - Iniciar OAuth Google
- `GET /auth/google/callback` - Callback OAuth Google
- `GET /auth/github` - Iniciar OAuth GitHub
- `GET /auth/github/callback` - Callback OAuth GitHub

### Usuários (`/api/users`) - 14 endpoints
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/search?name=TERMO` - Buscar usuários por nome
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário
- `PUT /api/users/:id/settings` - Atualizar configurações (idioma, tema)
- `PUT /api/users/:id/edit` - Editar perfil
- `GET /api/users/:id/followers` - Listar seguidores
- `GET /api/users/:id/following` - Listar usuários seguidos
- `GET /api/users/:id/connections` - Listar conexões
- `GET /api/users/:id/posts` - Listar posts do usuário
- `GET /api/users/:id/notifications` - Listar notificações do usuário
- `POST /api/users/:id/follow` - Seguir/Deixar de seguir usuário
- `POST /api/users/:id/achievements` - Adicionar conquista ao usuário

### Posts (`/api/posts`) - 8 endpoints
- `GET /api/posts` - Listar posts do feed (exclui posts do fórum)
- `POST /api/posts` - Criar novo post
- `GET /api/posts/:id` - Obter post por ID
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post
- `POST /api/posts/:id/like` - Curtir/Descurtir post
- `POST /api/posts/:id/comments` - Adicionar comentário ao post
- `GET /api/posts/:id/comments` - Listar comentários do post

### Comentários (`/api/comments`) - 5 endpoints
- `GET /api/comments` - Listar todos os comentários
- `POST /api/comments/:id/like` - Curtir/Descurtir comentário
- `GET /api/comments/:id` - Obter comentário por ID
- `PUT /api/comments/:id` - Atualizar comentário
- `DELETE /api/comments/:id` - Deletar comentário

### Fórum (`/api/forum`) - 4 endpoints
- `GET /api/forum/topics` - Listar todos os tópicos
- `POST /api/forum/topics` - Criar novo tópico
- `GET /api/forum/topics/:id` - Obter tópico por ID com posts
- `POST /api/forum/topics/:id/reply` - Adicionar resposta ao tópico (+15 XP)

### Notificações (`/api/notifications`) - 3 endpoints
- `GET /api/notifications?userId=ID` - Listar notificações do usuário
- `PUT /api/notifications/:id/read` - Marcar notificação como lida
- `DELETE /api/notifications/:id` - Deletar notificação

### Ranking (`/api/ranking`) - 1 endpoint
- `GET /api/ranking` - Listar top 100 usuários por XP

### Chat (`/api/chat`) - 6 endpoints
- `GET /api/chat?userId=ID` - Listar conversas do usuário
- `PUT /api/chat/:userId/read?currentUserId=ID` - Marcar mensagens como lidas
- `DELETE /api/chat/messages/:messageId?currentUserId=ID` - Deletar mensagem
- `GET /api/chat/:userId/messages?currentUserId=ID` - Obter mensagens entre dois usuários
- `POST /api/chat/:userId/messages` - Enviar mensagem
- `DELETE /api/chat/:userId?currentUserId=ID` - Deletar conversa completa

---

## 🌳 Estrutura de Arquivos do Projeto

```
lab-final/
│
├── 📄 server.js                          # Servidor Express + Next.js customizado
│                                          # Configura middleware, rotas, CORS, sessões OAuth
│
├── 📄 package.json                       # Dependências e scripts do projeto
├── 📄 next.config.mjs                    # Configuração do Next.js
├── 📄 postcss.config.mjs                 # Configuração do PostCSS/Tailwind
├── 📄 eslint.config.mjs                  # Configuração do ESLint
├── 📄 jsconfig.json                      # Configuração JavaScript/Path aliases
│
├── 📁 lib/                               # Bibliotecas e utilitários do backend
│   ├── mongodb.js                        # Conexão com MongoDB e função connectDB()
│   ├── passport.js                       # Configuração Passport.js para OAuth (Google/GitHub)
│   └── mentionUtils.js                   # Utilitário para processar menções @usuario em posts
│
├── 📁 models/                            # Modelos Mongoose (schemas do banco)
│   ├── user.js                           # Schema: usuário (email, senha, XP, followers, etc.)
│   ├── post.js                           # Schema: post (conteúdo, autor, likes, comentários, topic)
│   ├── comment.js                        # Schema: comentário (conteúdo, autor, post, parentComment)
│   ├── topic.js                          # Schema: tópico do fórum (nome, descrição, categoria)
│   ├── message.js                        # Schema: mensagem privada (sender, receiver, content, read)
│   ├── notification.js                   # Schema: notificação (user, from, type, read, relatedPost/Comment/Topic)
│   └── connectionRequest.js              # Schema: solicitação de conexão (não mais utilizado)
│
├── 📁 routes/                            # Rotas Express (backend API)
│   ├── authRoutes.js                     # Rotas: registro, login, logout, OAuth Google/GitHub
│   ├── userRoutes.js                     # Rotas: CRUD usuários, seguir, conquistas, followers, etc.
│   ├── postRoutes.js                     # Rotas: CRUD posts, likes, comentários (feed)
│   ├── commentRoutes.js                  # Rotas: CRUD comentários, likes
│   ├── forumRoutes.js                    # Rotas: CRUD tópicos, respostas no fórum (+15 XP)
│   ├── chatRoutes.js                     # Rotas: mensagens privadas, conversas, marcar como lida
│   ├── notificationRoutes.js             # Rotas: listar, marcar como lida, deletar notificações
│   └── rankingRoutes.js                  # Rotas: ranking de XP dos usuários
│
├── 📁 public/                            # Arquivos estáticos servidos diretamente
│   ├── bk.png                            # Imagem de background
│   ├── btPuzzle.svg                      # SVG do botão de conexão (puzzle piece)
│   ├── default-avatar.svg                # Avatar padrão para usuários sem foto
│   └── file.svg                          # Ícone de arquivo
│
├── 📁 src/                               # Código frontend (Next.js)
│   │
│   ├── 📁 pages/                         # Páginas Next.js (rotas do frontend)
│   │   ├── _app.js                       # Componente raiz do Next.js (providers, contexto global)
│   │   ├── _document.js                  # HTML customizado do Next.js
│   │   ├── index.js                      # Página inicial: Login e Registro
│   │   ├── home.js                       # Feed principal: timeline de posts
│   │   ├── profile.js                    # Página de perfil (próprio ou outros usuários)
│   │   ├── settings.js                   # Configurações: idioma, tema, edição de perfil
│   │   ├── chat.js                       # Chat privado entre usuários
│   │   │
│   │   ├── 📁 post/                      # Páginas relacionadas a posts
│   │   │   └── [id].js                   # Página de visualização individual de post
│   │   │
│   │   ├── 📁 forum/                     # Páginas do fórum
│   │   │   ├── index.js                  # Lista de tópicos do fórum
│   │   │   ├── ranking.js                # Ranking de XP dos usuários
│   │   │   └── topic.js                  # Visualização de tópico específico com posts
│   │   │
│   │   └── 📁 api/                       # API Routes do Next.js (proxies para backend Express)
│   │       ├── auth.js                   # Proxy: autenticação (register, login, OAuth)
│   │       ├── users.js                  # Proxy: operações de usuários
│   │       ├── posts.js                  # Proxy: operações de posts
│   │       ├── comments.js               # Proxy: operações de comentários
│   │       ├── forum.js                  # Proxy: operações do fórum
│   │       ├── chat.js                   # Proxy: operações de chat
│   │       ├── notifications.js          # Proxy: operações de notificações
│   │       ├── ranking.js                # Proxy: ranking de XP
│   │       ├── search.js                 # Proxy: busca de usuários
│   │       └── connections.js            # Proxy: conexões (não mais utilizado)
│   │
│   ├── 📁 components/                    # Componentes React reutilizáveis
│   │   ├── LoginForm.jsx                 # Formulário de login (com animação do botão puzzle)
│   │   ├── RegisterForm.jsx              # Formulário de registro (com validação completa)
│   │   ├── PostCard.jsx                  # Card de post no feed (exibe post, autor, likes, comentários)
│   │   ├── CommentCard.jsx               # Card de comentário (suporta respostas aninhadas)
│   │   ├── UserCard.jsx                  # Card de usuário (usado em buscas, listagens)
│   │   ├── TopicCard.jsx                 # Card de tópico do fórum
│   │   ├── ChatPane.jsx                  # Painel lateral de chat (lista de conversas)
│   │   ├── SearchBar.jsx                 # Barra de busca de usuários
│   │   ├── Notificacoes.jsx              # Componente de notificações (badge e dropdown)
│   │   ├── AchievementCard.jsx           # Card de conquista (exibido no perfil)
│   │   │
│   │   └── 📁 ui/                        # Componentes UI básicos
│   │       ├── Navbar.jsx                # Barra de navegação superior
│   │       ├── Footer.jsx                # Rodapé da aplicação
│   │       ├── AlertModal.jsx            # Modal de alerta/erro genérico
│   │       ├── PostModal.jsx             # Modal para criar/editar post
│   │       ├── EditPostModal.jsx         # Modal para editar post existente
│   │       ├── EditProfileModal.jsx      # Modal para editar perfil
│   │       ├── TopicModal.jsx            # Modal para criar novo tópico no fórum
│   │       ├── AddAchievementModal.jsx   # Modal para adicionar conquista ao perfil
│   │       ├── UsersListModal.jsx        # Modal para exibir lista de usuários (seguidores, seguindo)
│   │       ├── FollowButton.jsx          # Botão de seguir/deixar de seguir (com ícones)
│   │       ├── BackButton.jsx            # Botão de voltar (com ícone de seta)
│   │       ├── CodemiaLogo.jsx           # Logo da aplicação
│   │       ├── ShareButton.jsx           # Botão de compartilhar post
│   │       ├── ImageUpload.jsx           # Componente de upload de imagem
│   │       ├── MentionAutocomplete.jsx   # Autocomplete para menções @usuario
│   │       └── MentionTextarea.jsx       # Textarea com suporte a menções @usuario
│   │
│   ├── 📁 context/                       # Contextos React (state management)
│   │   └── ThemeLanguageContext.js       # Contexto: tema (light/dark) e idioma (PT/EN)
│   │                                     # Gerencia preferências do usuário globalmente
│   │
│   ├── 📁 services/                      # Serviços de API (cliente HTTP)
│   │   └── api.js                        # Funções para chamar endpoints do backend
│   │                                     # Organizado por módulos: authAPI, usersAPI, postsAPI, etc.
│   │
│   ├── 📁 styles/                        # Estilos globais
│   │   └── globals.css                   # CSS global da aplicação
│   │
│   └── 📁 utils/                         # Utilitários do frontend
│       ├── auth.js                       # Funções de autenticação (handleOAuthCallback, checkOAuthError)
│       └── mentionRenderer.js            # Renderizador de menções @usuario em texto (converte para links)
│
├── 📄 README.md                          # Documentação geral do projeto
├── 📄 INSTRUCTIONS.md                    # Instruções de instalação e uso
├── 📄 OAUTH_SETUP.md                     # Guia de configuração OAuth (Google/GitHub)
└── 📄 PROJECT_STRUCTURE.md               # Este arquivo: estrutura completa do projeto
```

---

## 🔄 Fluxo de Dados

### Autenticação
1. Usuário faz login/registro → `authRoutes.js` → JWT gerado → Armazenado no localStorage
2. OAuth: Usuário clica em Google/GitHub → Redireciona para provider → Callback → JWT gerado

### Feed de Posts
1. Frontend: `home.js` → `postsAPI.getPosts()` → `src/pages/api/posts.js` (proxy)
2. Proxy Next.js → `routes/postRoutes.js` → MongoDB → Retorna posts populados
3. Frontend renderiza posts com `PostCard.jsx`

### Fórum
1. Frontend: `forum/index.js` → Lista tópicos → `forum/topic.js` → Exibe posts do tópico
2. Criar resposta: `forumRoutes.js` → Cria post vinculado ao tópico → +15 XP para autor

### Chat
1. Frontend: `chat.js` → `chatAPI.getConversations()` → Agrupa mensagens por usuário
2. Seleciona conversa → `chatAPI.getMessages()` → Exibe mensagens em tempo real (polling)
3. Enviar: `chatAPI.sendMessage()` → Cria mensagem → Atualiza lista

### Notificações
1. Backend: Ações (like, comment, follow) → Cria `Notification` → Salva no MongoDB
2. Frontend: `Notificacoes.jsx` → Polling periódico → `notificationAPI.getNotifications()`
3. Exibe badge com contagem de não lidas

### Sistema de XP
- Posts no fórum: +15 XP (ao criar via `forumRoutes.js`)
- Comentários no fórum: +3 XP (ao criar comentário em post com `topic`)
- Curtidas no fórum: +1 XP (ao curtir post com `topic`)
- Feed: Nenhum XP (posts do feed não geram XP)

---

## 🗄️ Modelos de Dados (Mongoose Schemas)

### User
```javascript
{
  name, email, password (hash), userType, institution, birthDate,
  bio, profilePicture, xp (default: 0),
  followers: [ObjectId], following: [ObjectId], connections: [ObjectId],
  achievements: [{ title, type, description, date, technologies, image }],
  language, theme,
  createdAt, updatedAt
}
```

### Post
```javascript
{
  author: ObjectId, content, image, topic: ObjectId (null para feed),
  likes: [ObjectId], comments: [ObjectId],
  tags: [String],
  createdAt, updatedAt
}
```

### Comment
```javascript
{
  author: ObjectId, post: ObjectId, content,
  parentComment: ObjectId (para respostas aninhadas),
  likes: [ObjectId],
  createdAt, updatedAt
}
```

### Topic (Fórum)
```javascript
{
  name, description, category,
  posts: [ObjectId],
  createdAt, updatedAt
}
```

### Message (Chat)
```javascript
{
  sender: ObjectId, receiver: ObjectId, content,
  read: Boolean,
  createdAt, updatedAt
}
```

### Notification
```javascript
{
  user: ObjectId, from: ObjectId, type: String,
  read: Boolean,
  relatedPost: ObjectId, relatedComment: ObjectId, relatedTopic: ObjectId,
  createdAt, updatedAt
}
```

---

## 🔐 Autenticação e Autorização

- **JWT**: Tokens armazenados no localStorage, enviados via header `Authorization`
- **OAuth**: Passport.js com Google OAuth 2.0 e GitHub OAuth 2.0
- **Sessões**: Express-session para OAuth callbacks
- **Senhas**: bcryptjs para hash de senhas (no modelo User)

---

## 📦 Principais Dependências

### Backend
- `express`: Servidor HTTP
- `mongoose`: ODM para MongoDB
- `passport`, `passport-google-oauth20`, `passport-github2`: OAuth
- `jsonwebtoken`: JWT para autenticação
- `bcryptjs`: Hash de senhas
- `express-session`: Gerenciamento de sessões

### Frontend
- `next`: Framework React (SSR/SSG)
- `react`, `react-dom`: Biblioteca React
- `react-icons`: Ícones SVG (Font Awesome, Simple Icons, etc.)

---

## 🎨 Tecnologias Utilizadas

- **Frontend**: Next.js 16, React 19, CSS-in-JS (inline styles)
- **Backend**: Express 5, Node.js (ES Modules)
- **Banco de Dados**: MongoDB com Mongoose
- **Autenticação**: JWT + OAuth 2.0 (Google, GitHub)
- **Deployment**: Node.js server (custom server.js)

---

*Última atualização: Documentação completa da estrutura do projeto CodeConnect*

