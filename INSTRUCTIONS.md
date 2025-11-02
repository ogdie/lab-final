# Instruções para Executar o CodeConnect

## 📋 Pré-requisitos

1. **MongoDB** instalado e rodando
   - Windows: Baixe do site oficial ou use MongoDB Atlas (cloud)
   - Certifique-se de que o MongoDB está rodando na porta 27017

2. **Node.js** versão 16 ou superior
   - Verifique com: `node --version`

## 🚀 Como Iniciar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar MongoDB

Opção A: MongoDB Local
- Certifique-se de que o MongoDB está rodando
- A string de conexão já está configurada em `.env`

Opção B: MongoDB Atlas (Cloud)
- Crie uma conta em https://www.mongodb.com/cloud/atlas
- Obtenha a string de conexão
- Substitua `MONGODB_URI` no arquivo `.env`

### 3. Iniciar o Servidor

```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3000

## 🔐 Credenciais de Teste

Crie uma conta pelo formulário de registro na página inicial.

## 📱 Funcionalidades Principais

### Páginas Disponíveis:
- **/** - Login e Registro (com OAuth Google/GitHub)
- **/home** - Feed principal com posts e timeline
- **/forum** - Fórum por tópicos de programação
- **/forum/topic?id=TOPIC_ID** - Visualização de tópico específico
- **/forum/ranking** - Ranking de XP dos usuários
- **/profile?id=USER_ID** - Perfil do usuário (próprio ou outros)
- **/post/[id]** - Visualização individual de post
- **/settings** - Configurações (idioma, tema, perfil, conquistas)
- **/chat?userId=USER_ID** - Mensagens e conversas privadas

### Recursos:
- ✅ Sistema de autenticação JWT com OAuth (Google e GitHub)
- ✅ Posts do feed e comentários
- ✅ Sistema de curtidas e menções (@usuario)
- ✅ Notificações em tempo real
- ✅ Sistema de seguir/deixar de seguir
- ✅ Chat privado entre usuários
- ✅ Fórum técnico por tópicos de programação
- ✅ Sistema de XP e ranking (gamificação)
- ✅ Conquistas (achievements) personalizáveis
- ✅ Configurações de idioma (PT/EN) e tema (light/dark)
- ✅ Busca de usuários
- ✅ Edição de perfil com upload de imagem

## 🎮 Sistema de XP

- **Postar no Fórum**: +15 XP
- **Comentar no Fórum**: +3 XP
- **Receber Curtida no Fórum**: +1 XP
- **Nota**: Posts do feed não geram XP, apenas interações no fórum

## 🛠️ Estrutura de Arquivos

```
labfinal/
├── models/          # Modelos Mongoose
├── routes/          # Rotas Express
├── src/
│   ├── components/ # Componentes React
│   ├── pages/      # Páginas e API Next.js
│   ├── services/   # Funções de API
│   └── styles/     # Estilos CSS
├── server.js       # Servidor principal
└── package.json    # Dependências
```

## ⚠️ Troubleshooting

### Erro: MongoDB não conecta
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env`

### Erro: Porta 3000 já em uso
- Mude a porta no arquivo `.env` ou pare o outro processo

### Erro: Módulos não encontrados
```bash
npm install
```

## 📞 Suporte

Consulte o arquivo `README.md` para mais informações sobre a API e endpoints.

