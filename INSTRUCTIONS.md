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
- **/** - Login e Registro
- **/home** - Feed principal com posts
- **/forum** - Fórum por tópicos de programação
- **/forum/ranking** - Ranking de XP dos usuários
- **/profile?id=USER_ID** - Perfil do usuário
- **/settings** - Configurações (idioma, tema, perfil)
- **/chat** - Mensagens e conversas

### Recursos:
- ✅ Sistema de autenticação JWT
- ✅ Posts e comentários com XP
- ✅ Notificações em tempo real
- ✅ Sistema de conexões (como LinkedIn)
- ✅ Chat entre usuários
- ✅ Fórum técnico por linguagem
- ✅ Ranking de XP (gamificação)
- ✅ Configurações de idioma e tema

## 🎮 Sistema de XP

- **Criar Post**: +20 XP
- **Comentar**: +3 XP
- **Receber Curtida**: +1 XP
- **Postar no Fórum**: +15 XP

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

