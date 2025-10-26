# CodeConnect

Rede social para estudantes de programação com gamificação, fóruns técnicos e sistema de XP.

## 🚀 Funcionalidades

- ✅ Autenticação JWT
- ✅ Posts e Comentários
- ✅ Sistema de Curtidas
- ✅ Sistema de Conexões
- ✅ Notificações em tempo real
- ✅ Chat entre usuários
- ✅ Fórum por tópicos de linguagem
- ✅ Ranking de XP
- ✅ Gamificação (XP por ações)
- ✅ Configurações de idioma e tema

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
├── lib/
│   └── mongodb.js          # Conexão MongoDB
├── models/                  # Modelos Mongoose
├── routes/                  # Rotas Express
├── src/
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas Next.js
│   ├── services/           # API services
│   └── styles/             # Estilos
├── server.js               # Servidor principal
└── package.json
```

## 🎯 Endpoints API

### Auth
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Posts
- `GET /api/posts` - Listar posts
- `POST /api/posts` - Criar post
- `GET /api/posts/:id` - Obter post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post
- `POST /api/posts/:id/like` - Curtir post
- `POST /api/posts/:id/comments` - Adicionar comentário

### Chat
- `GET /api/chat` - Listar conversas
- `GET /api/chat/:id/messages` - Obter mensagens
- `POST /api/chat/:id/messages` - Enviar mensagem

### Fórum
- `GET /api/forum/topics` - Listar tópicos
- `POST /api/forum/topics` - Criar tópico
- `GET /api/forum/topics/:id` - Obter tópico

### Ranking
- `GET /api/ranking` - Ranking de XP

## 💻 Tecnologias

- **Frontend**: Next.js 16, React 19
- **Backend**: Express.js 5, Node.js
- **Database**: MongoDB com Mongoose
- **Authentication**: JWT
- **UI**: CSS com Tailwind CSS opcional

## 📝 Sistema de XP

- Criar post: +20 XP
- Comentar: +3 XP
- Receber curtida: +1 XP
- Participar no fórum: +15 XP

## 🔐 Segurança

- Senhas criptografadas com bcryptjs
- Autenticação JWT
- Validação de dados
- CORS configurado

## 📱 Responsividade

Interface otimizada para desktop, tablet e mobile.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, faça um fork e envie um pull request.

## 📄 Licença

Este projeto está sob a licença MIT.
