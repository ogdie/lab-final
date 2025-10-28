import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import passport from "../lib/passport.js";

const router = express.Router();

const ALLOWED_INSTITUTIONS = [
  "Faculdade de Engenharia da Universidade do Porto (FEUP)",
  "Faculdade de Ciências da Universidade do Porto (FCUP)",
  "Instituto Superior de Engenharia do Porto (ISEP – Politécnico do Porto)",
  "Instituto Superior de Tecnologias Avançadas do Porto (ISTEC Porto)",
  "Universidade Portucalense (UPT)",
  "42 Porto",
  "Academia de Código (Porto)",
  "EDIT. – Disruptive Digital Education (Porto)",
  "ATEC- Academia de Formação",
  "Bytes4Future",
  "Tokio School",
  "Outros"
];

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeText = (v) => String(v || "").trim();

const isValidBirthDate = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const min = new Date("1900-01-01");
  const today = new Date();
  return d >= min && d <= today;
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  userType: user.userType,
  institution: user.institution,
  birthDate: user.birthDate,
  bio: user.bio,
  profilePicture: user.profilePicture,
  xp: user.xp,
  language: user.language,
  theme: user.theme,
  followers: user.followers,
  following: user.following,
  connections: user.connections,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      userType,
      institution,
      birthDate
    } = req.body || {};

    const nameNorm = normalizeText(name);
    const emailNorm = normalizeEmail(email);
    const instNorm = normalizeText(institution);

    if (!nameNorm || !emailNorm || !password || !instNorm || !birthDate) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres." });
    }
    if (!ALLOWED_INSTITUTIONS.includes(instNorm)) {
      return res.status(400).json({ error: "Instituição inválida." });
    }
    if (!isValidBirthDate(birthDate)) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    const existingUser = await User.findOne({ email: emailNorm }).lean();
    if (existingUser) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    const user = await User.create({
      name: nameNorm,
      email: emailNorm,
      password,
      userType: ["Estudante", "Professor", "Recrutador"].includes(userType) ? userType : "Estudante",
      institution: instNorm,
      birthDate
    });

    const token = generateToken(user._id);
    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }
    return res.status(500).json({ error: "Erro ao cadastrar." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const emailNorm = normalizeEmail(email);

    if (!emailNorm || !password) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      return res.status(404).json({ error: "Usuário não cadastrado." });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = generateToken(user._id);
    return res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao entrar." });
  }
});

// Logout
router.post("/logout", (req, res) => {
  return res.json({ message: "Logout realizado" });
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=oauth' }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      // Redirect to frontend with token
      res.redirect(`/?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    } catch (error) {
      res.redirect('/login?error=oauth');
    }
  }
);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=oauth' }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      // Redirect to frontend with token
      res.redirect(`/?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    } catch (error) {
      res.redirect('/login?error=oauth');
    }
  }
);

export default router;
