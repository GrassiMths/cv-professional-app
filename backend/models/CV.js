const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String,
});

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  startDate: String,
  endDate: String,
  description: String,
});

const CVSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  location: String,
  summary: String,
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  skills: [String],
  projects: [{ name: String, desc: String, link: String }],
  languages: [
    {
      language: { type: String, required: true },
      level: { type: String, required: true },
    },
  ],
  photoUrl: String,
  linkedin: String,
  lattes: String,
  template: { type: String, default: "modern" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Adicione um middleware para atualizar o updatedAt
CVSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("CV", CVSchema);
