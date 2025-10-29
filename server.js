import express from "express";
import next from "next";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { connectDB } from "./lib/mongodb.js";
import passport from "./lib/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
// connectionRoutes removido

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

async function start() {
  try {
    await connectDB();
    await app.prepare();

    const server = express();
    server.use(cors({
      origin: process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://localhost:3000',
      credentials: true
    }));
    server.use(express.json());
    
    // Session configuration for OAuth
    server.use(session({
      secret: process.env.SESSION_SECRET || 'your-session-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
    
    // Passport middleware
    server.use(passport.initialize());
    server.use(passport.session());
    
    // API Routes (Express handles these)
    server.use('/api/auth', authRoutes);
    // Also expose non-API OAuth routes to match provider redirect URIs
    server.use('/auth', authRoutes);
    server.use('/api/users', userRoutes);
    server.use('/api/posts', postRoutes);
    server.use('/api/comments', commentRoutes);
    server.use('/api/notifications', notificationRoutes);
    server.use('/api/ranking', rankingRoutes);
    server.use('/api/forum', forumRoutes);
    server.use('/api/chat', chatRoutes);
    // server.use('/api/connections', connectionRoutes);

    // Next.js handler - only for non-API routes
    server.use((req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`Servidor rodando (Next + Express) em http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();