# CodeConnect

Rede social para estudantes, professores e recrutadores de programação com gamificação, fóruns técnicos e sistema de XP.

## 🚀 Funcionalidades

### Autenticação
- ✅ Autenticação JWT (email/senha)
- ✅ OAuth 2.0 com Google e GitHub
- ✅ Registro com validação de instituições
- ✅ Gestão de sessão e tokens

### Conteúdo
- ✅ Feed de posts com timeline
- ✅ Sistema de curtidas e comentários
- ✅ Menções de usuários (@usuario)
- ✅ Upload de imagens em posts com compressão inteligente (até 2MB, qualidade preservada)
- ✅ Edição e exclusão de posts/comentários
- ✅ Tooltips informativos em componentes de upload

### Social
- ✅ Sistema de seguir/deixar de seguir
- ✅ Chat privado entre usuários
- ✅ Notificações em tempo real
- ✅ Busca de usuários
- ✅ Visualização de perfil (próprio e outros)

### Fórum Técnico
- ✅ Fórum por tópicos de programação
- ✅ Categorização por linguagem/tecnologia
- ✅ Respostas e discussões
- ✅ Sistema de XP baseado em participação

### Gamificação
- ✅ Sistema de XP (Experience Points)
- ✅ Ranking de usuários por XP (top 3 com bordas douradas/prateadas/bronze)
- ✅ Sistema completo de conquistas (achievements) com CRUD
  - Adicionar, editar e remover conquistas
  - Tipos: Certificação, Curso, Projeto, Competição, Publicação, Outros
  - Upload de imagens de alta qualidade para conquistas
  - Modal de detalhes com informações completas
  - Paginação (3 conquistas por vez)
  - Suporte completo a traduções (PT/EN)

### Personalização
- ✅ Tema claro/escuro (dark mode completo)
- ✅ Suporte multilíngue completo (PT/EN) com traduções dinâmicas
- ✅ Edição de perfil completa com upload de imagem
- ✅ Interface moderna com botões arredondados e cores roxas (#8B5CF6)
- ✅ Componentes responsivos e otimizados para mobile
- ✅ Sidebar de artigos recomendados ("TOP ARTIGOS PARA VOCÊ") na home e fórum
  - Artigos com imagens, títulos bilíngues (PT/EN) e instituições publicadoras
  - Borda roxa padronizada (#8B5CF6)
  - Layout sticky que acompanha o scroll
- ✅ Design system unificado com bordas roxas em todos os modais
- ✅ Sistema de busca padronizado com exibição de XP
  - Ícone de estrela colorido usando React Icons
  - Alinhamento consistente em todas as páginas
- ✅ Cards de usuário com exibição de tipo (userType) traduzido
  - Exibição dinâmica: Estudante/Student, Professor/Teacher, Recrutador/Recruiter

## 📋 Requisitos

- Node.js 16+
- MongoDB
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd labfinal
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
MONGODB_URI=mongodb://localhost:27017/codeconnect
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
labfinal/
├── lib/                    # Bibliotecas e utilitários (MongoDB, Passport)
├── models/                 # Modelos Mongoose (User, Post, Comment, Topic, etc.)
├── routes/                 # Rotas Express (API endpoints)
├── public/                 # Arquivos estáticos (imagens, SVGs)
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   │   └── ui/            # Componentes UI básicos
│   ├── pages/             # Páginas Next.js e API routes
│   ├── services/          # Serviços de API (cliente HTTP)
│   ├── context/           # Contextos React (tema, idioma)
│   ├── utils/             # Utilitários do frontend
│   └── styles/            # Estilos globais
├── server.js              # Servidor Express + Next.js
└── package.json
```

📖 **Para documentação detalhada da estrutura, veja [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

## 🎯 Endpoints API

**Total: 50 endpoints REST**

### Autenticação (`/api/auth`, `/auth`)
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/logout` - Logout
- `GET /auth/google` - Iniciar OAuth Google
- `GET /auth/google/callback` - Callback OAuth Google
- `GET /auth/github` - Iniciar OAuth GitHub
- `GET /auth/github/callback` - Callback OAuth GitHub

### Usuários (`/api/users`)
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/search?name=TERMO` - Buscar usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `PUT /api/users/:id/settings` - Atualizar configurações
- `PUT /api/users/:id/edit` - Editar perfil
- `GET /api/users/:id/followers` - Listar seguidores
- `GET /api/users/:id/following` - Listar seguindo
- `GET /api/users/:id/posts` - Posts do usuário
- `GET /api/users/:id/notifications` - Notificações
- `POST /api/users/:id/follow` - Seguir/Deixar de seguir
- `POST /api/users/:id/achievements` - Adicionar conquista
- `PUT /api/users/:id/achievements/:achievementId` - Atualizar conquista
- `DELETE /api/users/:id/achievements/:achievementId` - Remover conquista

### Posts (`/api/posts`)
- `GET /api/posts` - Listar posts do feed
- `POST /api/posts` - Criar post
- `GET /api/posts/:id` - Obter post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post
- `POST /api/posts/:id/like` - Curtir/Descurtir
- `POST /api/posts/:id/comments` - Adicionar comentário
- `GET /api/posts/:id/comments` - Listar comentários

### Comentários (`/api/comments`)
- `GET /api/comments` - Listar comentários
- `GET /api/comments/:id` - Obter comentário
- `PUT /api/comments/:id` - Atualizar comentário
- `DELETE /api/comments/:id` - Deletar comentário
- `POST /api/comments/:id/like` - Curtir comentário

### Fórum (`/api/forum`)
- `GET /api/forum/topics` - Listar tópicos
- `POST /api/forum/topics` - Criar tópico
- `GET /api/forum/topics/:id` - Obter tópico
- `POST /api/forum/topics/:id/reply` - Adicionar resposta

### Chat (`/api/chat`)
- `GET /api/chat?userId=ID` - Listar conversas
- `GET /api/chat/:userId/messages` - Obter mensagens
- `POST /api/chat/:userId/messages` - Enviar mensagem
- `PUT /api/chat/:userId/read` - Marcar como lida
- `DELETE /api/chat/messages/:messageId` - Deletar mensagem específica
- `DELETE /api/chat/:userId` - Deletar conversa completa

### Notificações (`/api/notifications`)
- `GET /api/notifications?userId=ID` - Listar notificações
- `PUT /api/notifications/:id/read` - Marcar como lida
- `DELETE /api/notifications/:id` - Deletar notificação

### Ranking (`/api/ranking`)
- `GET /api/ranking` - Top 100 usuários por XP

📖 **Para lista completa e detalhada, veja [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

## 💻 Tecnologias

### Frontend
- **Next.js 16** - Framework React (SSR/SSG)
- **React 19** - Biblioteca UI
- **React Icons** - Ícones SVG
- **CSS-in-JS** - Estilos inline

### Backend
- **Express.js 5** - Framework Node.js
- **Node.js** (ES Modules) - Runtime JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Mongoose 8** - ODM para MongoDB

### Autenticação
- **JWT** (jsonwebtoken) - Tokens de autenticação
- **Passport.js** - Middleware de autenticação
- **OAuth 2.0** - Google OAuth 20 e GitHub OAuth2
- **bcryptjs** - Hash de senhas

### Outras
- **Express Session** - Gerenciamento de sessões
- **CORS** - Cross-Origin Resource Sharing

## 📝 Sistema de XP

O sistema de gamificação recompensa apenas a participação no **fórum técnico**:

- ✅ **Postar no fórum**: +15 XP
- ✅ **Comentar no fórum**: +3 XP  
- ✅ **Receber curtida no fórum**: +1 XP

❌ **Posts do feed não geram XP** (apenas interações no fórum são recompensadas)

O ranking exibe os top 100 usuários ordenados por XP total.

## 🔐 Segurança

- ✅ Senhas criptografadas com **bcryptjs**
- ✅ Autenticação **JWT** com tokens expiráveis
- ✅ **OAuth 2.0** para login social (Google, GitHub)
- ✅ Validação de dados em todas as rotas
- ✅ **CORS** configurado adequadamente
- ✅ Sanitização de inputs (normalização de emails, trim de strings)
- ✅ Validação de instituições permitidas no registro

## 📱 Páginas Disponíveis

- **/** - Login e Registro (com OAuth)
- **/home** - Feed principal com timeline
- **/forum** - Lista de tópicos do fórum
- **/forum/topic?id=ID** - Visualização de tópico específico
- **/forum/ranking** - Ranking de XP
- **/profile?id=USER_ID** - Perfil do usuário
- **/post/[id]** - Visualização individual de post
- **/settings** - Configurações (idioma, tema, perfil)
- **/chat?userId=USER_ID** - Chat privado

## 📚 Documentação Adicional

- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Guia de instalação e execução
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Estrutura completa do projeto e todos os endpoints
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Configuração OAuth (Google/GitHub)

## 🚀 Quick Start

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd lab-final
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o `.env`**
   ```env
   MONGODB_URI=mongodb://localhost:27017/codeconnect
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-here
   SESSION_SECRET=your-session-secret-key
   # Opcional: OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Inicie o servidor**
   ```bash
   npm run dev
   ```

5. **Acesse**
   ```
   http://localhost:3000
   ```

📖 **Para mais detalhes, consulte [INSTRUCTIONS.md](./INSTRUCTIONS.md)**

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, faça um fork e envie um pull request.

## 🎨 Design System

### Cores Principais
- **Cor de ação (botões, links, destaques)**: `#8B5CF6` (Roxo)
- **Bordas padronizadas**: Todos os modais e componentes UI usam borda roxa (`#8B5CF6`)
- **Ranking**: Bordas especiais para top 3 (Dourado `#FFD700`, Prateado `#C0C0C0`, Bronze `#CD7F32`)

### Componentes Padronizados
- **Modais**: Bordas roxas unificadas em todos os modais da aplicação
- **Sidebars**: Borda roxa e layout sticky que acompanha o scroll
- **Botões**: Bordas arredondadas (`borderRadius: '24px'`), estilo consistente
- **Responsividade**: Componentes otimizados para mobile e desktop
- **Sistema de Busca**: Exibição de XP padronizada com ícone de estrela
- **Cards de Usuário**: Exibição de `userType` traduzido dinamicamente

## 📄 Licença

Este projeto está sob a licença MIT.
