import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

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

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: function () {
        return !this.oauthId;
      }
    },
    userType: { type: String, enum: ["Estudante", "Professor", "Recrutador"], default: "Estudante" },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    xp: { type: Number, default: 0 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    oauthId: String,
    oauthProvider: String,
    language: { type: String, enum: ["pt", "en"], default: "pt" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },

    institution: {
      type: String,
      enum: ALLOWED_INSTITUTIONS,
      default: "Outros",
      required: function () {
        return !this.oauthId;
      },
      trim: true
    },
    birthDate: {
      type: Date,
      required: function () {
        return !this.oauthId;
      },
      min: new Date("1900-01-01"),
      max: Date.now
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
