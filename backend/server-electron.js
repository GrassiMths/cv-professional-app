const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const puppeteer = require("puppeteer-core");
const path = require("path");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend no modo produção
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  console.log("📁 Servindo frontend de:", frontendPath);
}

// Conexão simplificada com MongoDB (em memória para demo)
mongoose
  .connect("mongodb://localhost:27017/cvprofessional", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.log("⚠️  MongoDB não disponível, usando modo sem persistência");
  });

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "CV Professional API running!",
    version: "2.3.0",
    author: "Matheus Grassi",
    mode: process.env.NODE_ENV || "development",
  });
});

// Rota principal para Electron
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// GERAR PDF - COMPLETAMENTE IDÊNTICO AO PREVIEW
app.post("/api/cv/generate", async (req, res) => {
  let browser;
  try {
    console.log("📄 Recebendo solicitação de PDF...");
    const data = req.body;

    // Validações básicas
    if (!data.name || !data.email || !data.title) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "Nome, email e título são obrigatórios",
      });
    }

    // Template HTML profissional IDÊNTICO AO PREVIEW
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Currículo - ${data.name}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            color: #1e293b;
            line-height: 1.6;
            font-size: 14px;
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 25px;
            margin-bottom: 30px;
            page-break-after: avoid;
        }
        
        .profile-section {
            display: flex;
            align-items: flex-start;
            gap: 25px;
            flex: 1;
        }
        
        .photo-container {
            flex-shrink: 0;
        }
        
        .photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #3b82f6;
        }
        
        .default-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: #f1f5f9;
            border: 3px solid #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
        }
        
        .default-photo .fa-user {
            font-size: 48px;
            color: #94a3b8;
        }
        
        .info {
            flex: 1;
        }
        
        .name { 
            font-size: 32px; 
            font-weight: 800; 
            color: #1e293b;
            margin: 0;
            line-height: 1.1;
            letter-spacing: -0.5px;
        }
        
        .title { 
            color: #3b82f6; 
            margin-top: 8px;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.3px;
        }
        
        .contact-info {
            text-align: right;
            font-size: 12px;
            line-height: 1.6;
            color: #475569;
            min-width: 250px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
            margin-bottom: 6px;
        }
        
        .contact-icon {
            width: 14px;
            height: 14px;
            color: #475569;
        }
        
        .fab.contact-icon {
            font-family: 'Font Awesome 6 Brands' !important;
        }
        
        .fas.contact-icon {
            font-family: 'Font Awesome 6 Free' !important;
            font-weight: 900;
        }
        
        .section { 
            margin-top: 25px; 
            page-break-inside: avoid;
        }
        
        .section h3 { 
            margin-bottom: 12px; 
            font-size: 16px; 
            text-transform: uppercase; 
            color: #3b82f6;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 6px;
            font-weight: 700;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-icon {
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            font-size: 14px;
            width: 16px;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
            position: relative;
        }
        
        .job-title {
            font-weight: 700;
            font-size: 15px;
            color: #1e293b;
            margin-bottom: 2px;
            padding-right: 40px;
        }
        
        .company {
            color: #3b82f6;
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 4px;
            padding-right: 40px;
        }
        
        .date {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
            margin-bottom: 6px;
            padding-right: 40px;
        }
        
        .description {
            font-size: 13px;
            line-height: 1.5;
            color: #475569;
            margin-top: 8px;
            padding-right: 40px;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }
        
        .skill-tag {
            background: #f1f5f9;
            color: #475569;
            padding: 6px 14px;
            border-radius: 12px;
            font-size: 12px;
            border: 1px solid #e2e8f0;
            font-weight: 500;
        }
        
        .languages {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 8px;
        }
        
        .language-item {
            background: #f8fafc;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            min-width: 180px;
        }
        
        .language-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 13px;
            margin-bottom: 4px;
        }
        
        .language-level {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .links {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 8px;
        }
        
        .link-item {
            color: #3b82f6;
            text-decoration: none;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .link-icon {
            font-family: 'Font Awesome 6 Brands';
            font-size: 12px;
            width: 14px;
        }
        
        .fa-graduation-cap.link-icon {
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
        }
        
        .empty-state {
            font-style: italic;
            color: #64748b;
            font-size: 13px;
            padding: 8px 0;
            text-align: center;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 20px;
        }
        
        .column {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        @media print {
            body { 
                padding: 25px !important; 
                font-size: 13px !important;
            }
            .header {
                padding-bottom: 20px !important;
                margin-bottom: 25px !important;
            }
            .name {
                font-size: 28px !important;
            }
            .title {
                font-size: 16px !important;
            }
            .section {
                margin-top: 20px !important;
            }
            .experience-item, .education-item {
                margin-bottom: 15px !important;
            }
            
            .header, .section h3 {
                page-break-after: avoid !important;
            }
            
            .experience-item, .education-item {
                page-break-inside: avoid !important;
            }
        }
        
        @media (max-width: 600px) {
            body {
                padding: 20px !important;
            }
            .header {
                flex-direction: column !important;
                gap: 20px !important;
            }
            .profile-section {
                flex-direction: column !important;
                text-align: center !important;
            }
            .contact-info {
                text-align: center !important;
            }
            .contact-item {
                justify-content: center !important;
            }
            .two-column {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="profile-section">
            <div class="photo-container">
                ${
                  data.photoUrl
                    ? `<img src="${data.photoUrl}" class="photo" alt="Foto de perfil">`
                    : `<div class="default-photo"><i class="fas fa-user"></i></div>`
                }
            </div>
            <div class="info">
                <h1 class="name">${data.name}</h1>
                <div class="title">${data.title}</div>
            </div>
        </div>
        <div class="contact-info">
            ${
              data.email
                ? `
            <div class="contact-item">
                <i class="fas fa-envelope contact-icon"></i>
                <span>${data.email}</span>
            </div>`
                : ""
            }
            ${
              data.phone
                ? `
            <div class="contact-item">
                <i class="fas fa-phone contact-icon"></i>
                <span>${data.phone}</span>
            </div>`
                : ""
            }
            ${
              data.location
                ? `
            <div class="contact-item">
                <i class="fas fa-map-marker-alt contact-icon"></i>
                <span>${data.location}</span>
            </div>`
                : ""
            }
            ${
              data.linkedin
                ? `
            <div class="contact-item">
                <i class="fab fa-linkedin contact-icon"></i>
                <span>${data.linkedin}</span>
            </div>`
                : ""
            }
            ${
              data.lattes
                ? `
            <div class="contact-item">
                <i class="fas fa-graduation-cap contact-icon"></i>
                <span>${data.lattes}</span>
            </div>`
                : ""
            }
        </div>
    </div>

    <div class="section">
        <h3><i class="fas fa-user section-icon"></i>RESUMO PROFISSIONAL</h3>
        ${
          data.summary
            ? `<div class="description">${data.summary}</div>`
            : '<div class="empty-state">Profissional dedicado e comprometido com excelência em todas as atividades desenvolvidas.</div>'
        }
    </div>

    <div class="two-column">
        <div class="column">
            <div class="section">
                <h3><i class="fas fa-briefcase section-icon"></i>EXPERIÊNCIA PROFISSIONAL</h3>
                ${
                  data.experiences && data.experiences.length > 0
                    ? data.experiences
                        .map(
                          (exp) => `
                          <div class="experience-item">
                              <div class="job-title">${
                                exp.title || "Cargo não especificado"
                              }</div>
                              <div class="company">${
                                exp.company || "Empresa não especificada"
                              }</div>
                              <div class="date">${
                                exp.startDate || "Data não especificada"
                              } - ${
                            exp.current
                              ? "Atual"
                              : exp.endDate || "Data não especificada"
                          }</div>
                              ${
                                exp.description
                                  ? `<div class="description">${exp.description}</div>`
                                  : ""
                              }
                          </div>
                        `
                        )
                        .join("")
                    : '<div class="empty-state">Em busca da primeira oportunidade profissional.</div>'
                }
            </div>

            <div class="section">
                <h3><i class="fas fa-graduation-cap section-icon"></i>FORMAÇÃO ACADÊMICA</h3>
                ${
                  data.education && data.education.length > 0
                    ? data.education
                        .map(
                          (edu) => `
                          <div class="education-item">
                              <div class="job-title">${
                                edu.degree || "Curso não especificado"
                              }</div>
                              <div class="company">${
                                edu.institution ||
                                "Instituição não especificada"
                              }</div>
                              <div class="date">${
                                edu.startDate || "Data não especificada"
                              } - ${
                            edu.endDate || "Data não especificada"
                          }</div>
                              ${
                                edu.description
                                  ? `<div class="description">${edu.description}</div>`
                                  : ""
                              }
                          </div>
                        `
                        )
                        .join("")
                    : '<div class="empty-state">Formação acadêmica em andamento.</div>'
                }
            </div>
        </div>

        <div class="column">
            ${
              data.languages && data.languages.length > 0
                ? `
              <div class="section">
                  <h3><i class="fas fa-globe-americas section-icon"></i>IDIOMAS</h3>
                  <div class="languages">
                      ${data.languages
                        .map(
                          (lang) => `
                          <div class="language-item">
                              <div class="language-name">${lang.language}</div>
                              <div class="language-level">${lang.level}</div>
                          </div>
                      `
                        )
                        .join("")}
                  </div>
              </div>
              `
                : ""
            }

            <div class="section">
                <h3><i class="fas fa-bolt section-icon"></i>HABILIDADES</h3>
                ${
                  data.skills && data.skills.length > 0
                    ? `<div class="skills">
                      ${data.skills
                        .map(
                          (skill) => `
                          <span class="skill-tag">${skill}</span>
                      `
                        )
                        .join("")}
                    </div>`
                    : '<div class="empty-state">Habilidades técnicas e comportamentais em desenvolvimento.</div>'
                }
            </div>

            ${
              data.linkedin || data.lattes
                ? `
              <div class="section">
                  <h3>LINKS</h3>
                  <div class="links">
                      ${
                        data.linkedin
                          ? `<div class="link-item">
                            <i class="fab fa-linkedin link-icon"></i>
                            LinkedIn: ${data.linkedin}
                           </div>`
                          : ""
                      }
                      ${
                        data.lattes
                          ? `<div class="link-item">
                            <i class="fas fa-graduation-cap link-icon"></i>
                            Lattes: ${data.lattes}
                           </div>`
                          : ""
                      }
                  </div>
              </div>
              `
                : ""
            }
        </div>
    </div>
</body>
</html>
`;

    // Configurar Puppeteer para Electron
    const launchOptions = {
      executablePath: getChromePath(),
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    };

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({ width: 1240, height: 1754 });
    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });

    await page.waitForTimeout(1000);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm",
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true,
    });

    await browser.close();

    console.log("✅ PDF gerado com sucesso!");

    const fileName = `Curriculo_${data.name.replace(/\s+/g, "_")}.pdf`;
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Erro ao gerar PDF:", error);

    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      error: "Erro ao gerar PDF",
      details: error.message,
    });
  }
});

function getChromePath() {
  const { execSync } = require("child_process");

  try {
    if (process.platform === "win32") {
      // Windows
      const paths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
      ];

      for (const chromePath of paths) {
        try {
          require("fs").accessSync(chromePath);
          return chromePath;
        } catch (e) {}
      }

      // Tentar encontrar via comando
      try {
        return execSync("where chrome").toString().trim().split("\r\n")[0];
      } catch (e) {}
    } else if (process.platform === "darwin") {
      // macOS
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else {
      // Linux
      const paths = [
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium",
      ];

      for (const chromePath of paths) {
        try {
          require("fs").accessSync(chromePath);
          return chromePath;
        } catch (e) {}
      }
    }
  } catch (error) {
    console.log("⚠️  Não foi possível encontrar Chrome, usando fallback...");
  }

  // Fallback
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  } else if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else {
    return "/usr/bin/google-chrome";
  }
}

// Iniciar servidor
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Servidor backend rodando em: http://127.0.0.1:${PORT}`);
  console.log(`📄 Health check: http://127.0.0.1:${PORT}/api/health`);
  console.log(`👨‍💻 Desenvolvido por: Matheus Grassi`);
});

module.exports = app;
