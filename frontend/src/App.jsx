import { useState, useEffect } from "react";
import CVForm from "./components/CVForm";
import CVPreview from "./components/CVPreview";
import ThemeToggle from "./components/ThemeToggle";
import ExportButton from "./components/ExportButton";
import { useTheme } from "./ThemeContext";
import {
  FaFileAlt,
  FaEdit,
  FaEye,
  FaTrash,
  FaInstagram,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaCircle,
  FaDownload,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaBolt,
  FaGlobeAmericas,
} from "react-icons/fa";

function App() {
  const [cvData, setCvData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    linkedin: "",
    lattes: "",
    photoUrl: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [completedSections, setCompletedSections] = useState({
    personal: false,
    experience: false,
    education: false,
    skills: false,
    languages: false,
  });
  const { isDark } = useTheme();

  // Integração com Electron
  useEffect(() => {
    if (window.electronAPI) {
      // Menu: Novo Currículo
      window.electronAPI.onMenuNewCV(() => {
        if (
          window.confirm(
            "Deseja criar um novo currículo? Todos os dados atuais serão perdidos."
          )
        ) {
          clearAllData();
        }
      });

      // Menu: Exportar PDF
      window.electronAPI.onMenuExportPDF(() => {
        const exportButton = document.querySelector(".btn-primary");
        if (exportButton && !exportButton.disabled) {
          exportButton.click();
        } else {
          alert("Preencha os dados obrigatórios para exportar o PDF.");
        }
      });

      // Atualizar título com versão
      window.electronAPI.getAppVersion().then((version) => {
        document.title = `CV Professional v${version}`;
        const loadingText = document.getElementById("loading-text");
        if (loadingText) {
          loadingText.textContent = `Carregando CV Professional v${version}...`;
        }
      });
    }
  }, []);

  const updateCvData = (field, value) => {
    setCvData((prev) => ({
      ...prev,
      [field]: value,
    }));

    updateSectionProgress(field, value);
  };

  const updateSectionProgress = (field, value) => {
    setCompletedSections((prev) => {
      const newProgress = { ...prev };

      if (["name", "title", "email"].includes(field)) {
        newProgress.personal =
          cvData.name && cvData.title && cvData.email && value;
      }

      if (field === "experiences") {
        newProgress.experience = value && value.length > 0;
      }

      if (field === "education") {
        newProgress.education = value && value.length > 0;
      }

      if (field === "skills") {
        newProgress.skills = value && value.length > 0;
      }

      if (field === "languages") {
        newProgress.languages = value && value.length > 0;
      }

      return newProgress;
    });
  };

  const addExperience = (experience) => {
    setCvData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, experience],
    }));
    setCompletedSections((prev) => ({ ...prev, experience: true }));
  };

  const removeExperience = (index) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
    if (cvData.experiences.length <= 1) {
      setCompletedSections((prev) => ({ ...prev, experience: false }));
    }
  };

  const addEducation = (education) => {
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
    setCompletedSections((prev) => ({ ...prev, education: true }));
  };

  const removeEducation = (index) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
    if (cvData.education.length <= 1) {
      setCompletedSections((prev) => ({ ...prev, education: false }));
    }
  };

  const addSkill = (skill) => {
    if (skill.trim() && !cvData.skills.includes(skill.trim())) {
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
      setCompletedSections((prev) => ({ ...prev, skills: true }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
    if (cvData.skills.length <= 1) {
      setCompletedSections((prev) => ({ ...prev, skills: false }));
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCvData((prev) => ({
          ...prev,
          photoUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCvData((prev) => ({
      ...prev,
      photoUrl: "",
    }));
  };

  const clearAllData = () => {
    setCvData({
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      linkedin: "",
      lattes: "",
      photoUrl: "",
    });
    setCompletedSections({
      personal: false,
      experience: false,
      education: false,
      skills: false,
      languages: false,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt`
            );
            const data = await response.json();

            let city = "";
            let state = "";

            if (data.address) {
              city =
                data.address.city ||
                data.address.town ||
                data.address.municipality ||
                data.address.village ||
                "";

              if (data.address.state) {
                if (data.address.state.length === 2) {
                  state = data.address.state;
                } else {
                  const stateName = data.address.state.toLowerCase();
                  const stateMap = {
                    paraná: "PR",
                    parana: "PR",
                    "são paulo": "SP",
                    "sao paulo": "SP",
                    "rio de janeiro": "RJ",
                    "minas gerais": "MG",
                    bahia: "BA",
                    "rio grande do sul": "RS",
                    "santa catarina": "SC",
                    goiás: "GO",
                    goias: "GO",
                    pernambuco: "PE",
                    ceará: "CE",
                    ceara: "CE",
                    pará: "PA",
                    para: "PA",
                    maranhão: "MA",
                    maranhao: "MA",
                    amazonas: "AM",
                    "espírito santo": "ES",
                    "espirito santo": "ES",
                    paraíba: "PB",
                    paraiba: "PB",
                    "mato grosso": "MT",
                    "mato grosso do sul": "MS",
                    alagoas: "AL",
                    sergipe: "SE",
                    rondônia: "RO",
                    rondonia: "RO",
                    piauí: "PI",
                    piaui: "PI",
                    tocantins: "TO",
                    "rio grande do norte": "RN",
                    acre: "AC",
                    amapá: "AP",
                    amapa: "AP",
                    roraima: "RR",
                    "distrito federal": "DF",
                  };

                  state =
                    stateMap[stateName] ||
                    data.address.state
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase())
                      .join("");
                }
              }
            }

            let location = "";
            if (city && state) {
              location = `${city}, ${state}`;
            } else if (city) {
              location = city;
            } else if (data.display_name) {
              const parts = data.display_name.split(",");
              if (parts.length >= 2) {
                location = `${parts[0]}, ${parts[parts.length - 2].trim()}`;
              } else {
                location = data.display_name;
              }
            }

            if (location) {
              updateCvData("location", location);
            } else {
              alert(
                "Não foi possível determinar a localização precisa. Digite manualmente."
              );
            }
          } catch (error) {
            console.error("Erro ao obter localização:", error);
            alert("Erro ao obter localização. Digite manualmente.");
          }
        },
        (error) => {
          console.error("Erro de geolocalização:", error);
          let errorMessage = "Não foi possível acessar sua localização. ";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Permissão negada.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Localização indisponível.";
              break;
            case error.TIMEOUT:
              errorMessage += "Tempo esgotado.";
              break;
            default:
              errorMessage += "Erro desconhecido.";
          }

          alert(errorMessage);
        }
      );
    } else {
      alert("Geolocalização não suportada. Digite manualmente.");
    }
  };

  // Calcular progresso geral
  const totalProgress = Math.round(
    (Object.values(completedSections).filter(Boolean).length /
      Object.keys(completedSections).length) *
      100
  );

  // Estatísticas do currículo
  const stats = {
    experiences: cvData.experiences.length,
    education: cvData.education.length,
    skills: cvData.skills.length,
    languages: cvData.languages?.length || 0,
  };

  return (
    <div className={isDark ? "dark" : ""}>
      {/* Header Profissional */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <FaFileAlt className="logo-icon" />
              <div className="logo-text">
                <h1>CV Professional</h1>
                <p>
                  {window.electronAPI
                    ? "Desktop App"
                    : "Crie currículos profissionais em minutos"}
                </p>
              </div>
            </div>

            <div className="header-actions">
              {/* Indicador de Progresso */}
              {isEditing && (
                <div className="progress-indicator">
                  <div className="progress-circle-wrapper">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                      <circle
                        cx="30"
                        cy="30"
                        r="27"
                        stroke="var(--bg-secondary)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="27"
                        stroke="var(--primary-color)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${totalProgress * 1.7} 170`}
                        transform="rotate(-90 30 30)"
                      />
                    </svg>
                    <div className="progress-percentage">
                      <span>{totalProgress}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle de Tema */}
              <div className="theme-section">
                <span className="theme-label">
                  {isDark ? "Modo Escuro" : "Modo Claro"}
                </span>
                <ThemeToggle />
              </div>

              {/* Toggle de Visualização */}
              <div className="view-toggle hidden-desktop">
                <button
                  className={`toggle-btn ${isEditing ? "active" : ""}`}
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="icon-md" />
                  <span>Editar</span>
                </button>
                <button
                  className={`toggle-btn ${!isEditing ? "active" : ""}`}
                  onClick={() => setIsEditing(false)}
                >
                  <FaEye className="icon-md" />
                  <span>Visualizar</span>
                </button>
              </div>

              {/* Botões de Ação */}
              <div className="action-buttons">
                <button
                  onClick={clearAllData}
                  className="btn btn-outline"
                  title="Limpar todos os dados"
                >
                  <FaTrash className="icon-md" />
                  <span>Limpar Tudo</span>
                </button>

                <ExportButton cvData={cvData} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container">
        {/* Estatísticas Rápidas */}
        {isEditing && (
          <div className="stats-bar">
            <div className="stat-item">
              <FaBriefcase className="stat-icon" />
              <span className="stat-count">{stats.experiences}</span>
              <span className="stat-label">Experiências</span>
            </div>
            <div className="stat-item">
              <FaGraduationCap className="stat-icon" />
              <span className="stat-count">{stats.education}</span>
              <span className="stat-label">Formações</span>
            </div>
            <div className="stat-item">
              <FaBolt className="stat-icon" />
              <span className="stat-count">{stats.skills}</span>
              <span className="stat-label">Habilidades</span>
            </div>
            <div className="stat-item">
              <FaGlobeAmericas className="stat-icon" />
              <span className="stat-count">{stats.languages}</span>
              <span className="stat-label">Idiomas</span>
            </div>
          </div>
        )}

        <div className="main-layout">
          {/* Seção de Edição */}
          <div
            className={isEditing ? "editor-section fade-in" : "hidden-desktop"}
          >
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <FaEdit className="icon-lg" />
                  <div>
                    <h2>Criar Seu Currículo</h2>
                    <p>
                      Preencha as informações abaixo para criar um currículo
                      profissional
                    </p>
                  </div>
                </div>

                {/* Barra de progresso */}
                {isEditing && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${totalProgress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {totalProgress}% completo
                    </span>
                  </div>
                )}
              </div>
              <div className="card-body">
                <CVForm
                  cvData={cvData}
                  updateCvData={updateCvData}
                  addExperience={addExperience}
                  removeExperience={removeExperience}
                  addEducation={addEducation}
                  removeEducation={removeEducation}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                  onPhotoUpload={handlePhotoUpload}
                  onRemovePhoto={removePhoto}
                  onGetLocation={getCurrentLocation}
                  completedSections={completedSections}
                />
              </div>
            </div>
          </div>

          {/* Seção de Preview */}
          <div
            className={
              !isEditing
                ? "preview-section fade-in"
                : "hidden-desktop visible-desktop"
            }
          >
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <FaEye className="icon-lg" />
                  <div>
                    <h2>Pré-visualização do Currículo</h2>
                    <p>Visualização idêntica ao PDF que será gerado</p>
                  </div>
                </div>
                <ExportButton cvData={cvData} />
              </div>
              <div className="card-body">
                <CVPreview cvData={cvData} />

                <div className="preview-actions hidden-desktop">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    <FaEdit className="icon-md" />
                    <span>Voltar para Edição</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer com Assinatura */}
      <footer className="signature">
        <div className="container">
          <p>
            Desenvolvido por{" "}
            <a
              href="https://www.instagram.com/grassi.mths"
              target="_blank"
              rel="noopener noreferrer"
              className="signature-link"
            >
              <FaInstagram className="icon-sm" />
              Matheus Grassi
            </a>
          </p>
          <p className="signature-version">
            CV Professional v2.3.0 •{" "}
            {window.electronAPI ? "Desktop App" : "Sistema 100% Profissional"}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
