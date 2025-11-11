import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaTrash,
  FaBriefcase,
  FaGraduationCap,
  FaBolt,
  FaPlus,
  FaExclamationTriangle,
  FaGlobeAmericas,
  FaLinkedin,
  FaGraduationCap as FaLattes,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaCircle,
  FaStar,
  FaLanguage,
} from "react-icons/fa";

const CVForm = ({
  cvData,
  updateCvData,
  addExperience,
  removeExperience,
  addEducation,
  removeEducation,
  addSkill,
  removeSkill,
  onPhotoUpload,
  onRemovePhoto,
  onGetLocation,
  completedSections,
}) => {
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({ language: "", level: "" });
  const [errors, setErrors] = useState({});
  // REMOVIDO: estado do CEP
  const [expandedSections, setExpandedSections] = useState({
    personal: false,
    experience: false,
    education: false,
    skills: false,
    languages: false,
  });

  // Lista completa de idiomas
  const languageOptions = [
    "Português",
    "Inglês",
    "Espanhol",
    "Francês",
    "Alemão",
    "Italiano",
    "Japonês",
    "Chinês Mandarim",
    "Coreano",
    "Russo",
    "Árabe",
    "Holandês",
    "Sueco",
    "Norueguês",
    "Dinamarquês",
    "Finlandês",
    "Polonês",
    "Tcheco",
    "Húngaro",
    "Romeno",
    "Grego",
    "Turco",
    "Hebraico",
    "Hindi",
    "Tailandês",
    "Vietnamita",
    "Indonésio",
    "Malaio",
    "Filipino",
    "Swahili",
    "Ucraniano",
    "Búlgaro",
    "Croata",
    "Sérvio",
    "Eslovaco",
    "Esloveno",
    "Lituano",
    "Letão",
    "Estónio",
    "Maltês",
    "Islandês",
    "Galês",
    "Irlandês",
    "Escocês",
    "Catalão",
    "Basco",
    "Galego",
    "Luxemburguês",
    "Africâner",
    "Zulu",
    "Xhosa",
    "Amárico",
    "Somali",
    "Urdu",
    "Bengali",
    "Punjabi",
    "Marata",
    "Tâmil",
    "Telugu",
    "Guzerate",
    "Canarim",
    "Malaiala",
    "Oriá",
    "Burmese",
    "Khmer",
    "Laosiano",
    "Mongol",
    "Tibetano",
    "Uigure",
    "Cazaque",
    "Uzbeque",
    "Quirguiz",
    "Tajique",
    "Turcomeno",
    "Azeri",
    "Georgiano",
    "Armênio",
    "Persa",
    "Curdo",
    "Pashto",
    "Dari",
    "Sindi",
    "Nepalês",
    "Cingalês",
  ];

  const levelOptions = [
    {
      value: "Básico",
      label: "Básico (A1-A2)",
      description: "Comunicação simples",
    },
    {
      value: "Intermediário",
      label: "Intermediário (B1-B2)",
      description: "Conversação fluente",
    },
    {
      value: "Avançado",
      label: "Avançado (C1)",
      description: "Negociações complexas",
    },
    { value: "Fluente", label: "Fluente (C2)", description: "Como um nativo" },
    { value: "Nativo", label: "Nativo", description: "Língua materna" },
  ];

  // CORREÇÃO: Função para formatar data automaticamente - CORRIGIDA
  const formatDateInput = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Limita a 6 dígitos (MMAAAA)
    const limitedNumbers = numbers.slice(0, 6);

    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 4) {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
    } else {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2, 6)}`;
    }
  };

  // CORREÇÃO: Validação de data simplificada
  const validateDate = (dateString) => {
    if (!dateString) return true;
    const regex = /^\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    // Verifica se é uma data válida
    const [month, year] = dateString.split("/").map(Number);
    return month >= 1 && month <= 12 && year >= 1900 && year <= 2100;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Validações
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\d\s\(\)\-\+]+$/;
    return (
      re.test(phone) &&
      phone.replace(/\D/g, "").length >= 10 &&
      phone.replace(/\D/g, "").length <= 11
    );
  };

  const validateLinkedIn = (url) => {
    if (!url) return true;
    const re = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
    return re.test(url);
  };

  const validateLattes = (url) => {
    if (!url) return true;
    const re = /^https?:\/\/(.*\.)?lattes\.cnpq\.br\/.*$/;
    return re.test(url);
  };

  const handleFieldChange = (field, value) => {
    updateCvData(field, value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email é obrigatório";
        } else if (!validateEmail(value)) {
          newErrors.email = "Email inválido. Use o formato: seu@email.com";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (value && !validatePhone(value)) {
          newErrors.phone = "Telefone inválido. Use o formato (11) 99999-9999";
        } else {
          delete newErrors.phone;
        }
        break;

      case "linkedin":
        if (value && !validateLinkedIn(value)) {
          newErrors.linkedin = "URL do LinkedIn inválida";
        } else {
          delete newErrors.linkedin;
        }
        break;

      case "lattes":
        if (value && !validateLattes(value)) {
          newErrors.lattes = "URL Lattes inválida";
        } else {
          delete newErrors.lattes;
        }
        break;

      case "name":
        if (!value.trim()) {
          newErrors.name = "Nome completo é obrigatório";
        } else {
          delete newErrors.name;
        }
        break;

      case "title":
        if (!value.trim()) {
          newErrors.title = "Título profissional é obrigatório";
        } else {
          delete newErrors.title;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleAddExperience = () => {
    if (!newExperience.title.trim()) {
      setErrors((prev) => ({ ...prev, experience: "Cargo é obrigatório" }));
      return;
    }
    if (!newExperience.company.trim()) {
      setErrors((prev) => ({ ...prev, experience: "Empresa é obrigatória" }));
      return;
    }

    addExperience(newExperience);
    setNewExperience({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setErrors((prev) => ({ ...prev, experience: "" }));
  };

  const handleAddEducation = () => {
    if (!newEducation.degree.trim()) {
      setErrors((prev) => ({ ...prev, education: "Curso/grau é obrigatório" }));
      return;
    }
    if (!newEducation.institution.trim()) {
      setErrors((prev) => ({
        ...prev,
        education: "Instituição é obrigatória",
      }));
      return;
    }

    addEducation(newEducation);
    setNewEducation({
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setErrors((prev) => ({ ...prev, education: "" }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.language && newLanguage.level) {
      const languageExists = cvData.languages?.some(
        (lang) =>
          lang.language.toLowerCase() === newLanguage.language.toLowerCase()
      );

      if (languageExists) {
        setErrors((prev) => ({
          ...prev,
          language: "Este idioma já foi adicionado",
        }));
        return;
      }

      const updatedLanguages = [...(cvData.languages || []), newLanguage];
      updateCvData("languages", updatedLanguages);
      setNewLanguage({ language: "", level: "" });
      setErrors((prev) => ({ ...prev, language: "" }));
    }
  };

  const removeLanguage = (index) => {
    const updatedLanguages =
      cvData.languages?.filter((_, i) => i !== index) || [];
    updateCvData("languages", updatedLanguages);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  // REMOVIDO: função fetchAddressByCEP

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 11);

    if (limitedNumbers.length <= 11) {
      if (limitedNumbers.length <= 2) {
        return `(${limitedNumbers}`;
      } else if (limitedNumbers.length <= 7) {
        return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
      } else if (limitedNumbers.length <= 11) {
        return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
          2,
          7
        )}-${limitedNumbers.slice(7)}`;
      }
    }
    return value;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhone(value);
    handleFieldChange("phone", formatted);
  };

  const SectionHeader = ({
    title,
    icon,
    isCompleted,
    isExpanded,
    onToggle,
    children,
  }) => (
    <div className="section-header" onClick={onToggle}>
      <h3>
        {icon}
        {title}
        {isCompleted && <FaCheckCircle className="section-completed" />}
      </h3>
      <div className="section-controls">
        {children}
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    </div>
  );

  // Componente de nível de idioma com estrelas
  const LanguageLevelIndicator = ({ level }) => {
    const levelStars = {
      Básico: 1,
      Intermediário: 2,
      Avançado: 3,
      Fluente: 4,
      Nativo: 5,
    };

    const stars = levelStars[level] || 0;

    return (
      <div className="language-level-indicator">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < stars ? "star-filled" : "star-empty"}
          />
        ))}
        <span className="level-text">{level}</span>
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Informações Pessoais */}
      <div className="section-collapsible">
        <SectionHeader
          title="Informações Pessoais"
          icon={<FaUser className="icon-md" />}
          isCompleted={completedSections.personal}
          isExpanded={expandedSections.personal}
          onToggle={() => toggleSection("personal")}
        >
          {!completedSections.personal && (
            <FaCircle className="section-incomplete" />
          )}
        </SectionHeader>

        <div
          className={`section-content ${
            expandedSections.personal ? "" : "collapsed"
          }`}
        >
          {/* Foto de Perfil */}
          <div className="form-group">
            <label>
              <FaCamera className="icon-md" />
              Foto de Perfil (Opcional)
            </label>
            <div className="photo-upload">
              <div className="photo-preview">
                {cvData.photoUrl ? (
                  <img src={cvData.photoUrl} alt="Preview" />
                ) : (
                  <div className="photo-placeholder">
                    <FaUser size={32} />
                  </div>
                )}
              </div>
              <div className="photo-actions">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="btn btn-secondary">
                  <FaCamera className="icon-md" />
                  <span>Escolher Foto</span>
                </label>
                {cvData.photoUrl && (
                  <button onClick={onRemovePhoto} className="btn btn-danger">
                    <FaTrash className="icon-md" />
                    <span>Remover</span>
                  </button>
                )}
                <div className="photo-tips">
                  <p>• Formatos: JPG, PNG</p>
                  <p>• Tamanho máximo: 2MB</p>
                  <p>• Recomendado: 300x300px</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="required-field">
              <FaUser className="icon-md" />
              Nome Completo
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "error" : ""}`}
              value={cvData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={(e) => validateField("name", e.target.value)}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <div className="error-message">
                <FaExclamationTriangle className="icon-sm" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="required-field">
              <FaBriefcase className="icon-md" />
              Título Profissional
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "error" : ""}`}
              value={cvData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              onBlur={(e) => validateField("title", e.target.value)}
              placeholder="Ex: Desenvolvedor Full Stack, Analista de Marketing"
            />
            {errors.title && (
              <div className="error-message">
                <FaExclamationTriangle className="icon-sm" />
                {errors.title}
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="required-field">
                <FaEnvelope className="icon-md" />
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? "error" : ""}`}
                value={cvData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={(e) => validateField("email", e.target.value)}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <div className="error-message">
                  <FaExclamationTriangle className="icon-sm" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>
                <FaPhone className="icon-md" />
                Telefone
              </label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? "error" : ""}`}
                value={cvData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={(e) => validateField("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {errors.phone && (
                <div className="error-message">
                  <FaExclamationTriangle className="icon-sm" />
                  {errors.phone}
                </div>
              )}
            </div>
          </div>

          {/* CORREÇÃO: Apenas botão de localização - SEM CEP */}
          <div className="form-group">
            <label>
              <FaMapMarkerAlt className="icon-md" />
              Localização
            </label>

            <div className="location-section">
              {/* Apenas o botão de localização */}
              <div className="location-single-button">
                <button
                  type="button"
                  onClick={onGetLocation}
                  className="btn btn-outline location-btn-single"
                  style={{
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  <FaMapMarkerAlt className="icon-md" />
                  <span>Usar Minha Localização</span>
                </button>
              </div>

              {/* Campo de exibição da localização */}
              <input
                type="text"
                className="form-control location-display"
                value={cvData.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="Cidade, UF"
                style={{ marginTop: "0.5rem" }}
              />
              <div className="location-example">Exemplo: São Paulo, SP</div>
            </div>
          </div>

          {/* Links Profissionais */}
          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaLinkedin className="icon-md" />
                LinkedIn (Opcional)
              </label>
              <input
                type="url"
                className={`form-control ${errors.linkedin ? "error" : ""}`}
                value={cvData.linkedin || ""}
                onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                onBlur={(e) => validateField("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/seu-perfil"
              />
              {errors.linkedin && (
                <div className="error-message">
                  <FaExclamationTriangle className="icon-sm" />
                  {errors.linkedin}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>
                <FaLattes className="icon-md" />
                Lattes (Opcional)
              </label>
              <input
                type="url"
                className={`form-control ${errors.lattes ? "error" : ""}`}
                value={cvData.lattes || ""}
                onChange={(e) => handleFieldChange("lattes", e.target.value)}
                onBlur={(e) => validateField("lattes", e.target.value)}
                placeholder="http://lattes.cnpq.br/seu-id"
              />
              {errors.lattes && (
                <div className="error-message">
                  <FaExclamationTriangle className="icon-sm" />
                  {errors.lattes}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Resumo Profissional</label>
            <textarea
              className="form-control"
              value={cvData.summary}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
              placeholder="Descreva sua experiência, habilidades e objetivos profissionais de forma concisa e impactante..."
              rows="4"
            />
            <div className="textarea-info">
              <span>
                Dica: Seja específico sobre suas conquistas e use palavras-chave
                da sua área
              </span>
              <span
                className={`char-count ${
                  cvData.summary.length > 400 ? "warning" : ""
                }`}
              >
                {cvData.summary.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Experiência Profissional - CORRIGIDO: formatação automática de data */}
      <div className="section-collapsible">
        <SectionHeader
          title="Experiência Profissional"
          icon={<FaBriefcase className="icon-md" />}
          isCompleted={completedSections.experience}
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection("experience")}
        >
          {!completedSections.experience && (
            <FaCircle className="section-incomplete" />
          )}
        </SectionHeader>

        <div
          className={`section-content ${
            expandedSections.experience ? "" : "collapsed"
          }`}
        >
          {cvData.experiences.length === 0 && (
            <div className="empty-section">
              <FaBriefcase className="empty-icon" />
              <h4>Nenhuma experiência adicionada</h4>
              <p>
                Adicione suas experiências profissionais para enriquecer seu
                currículo
              </p>
            </div>
          )}

          <div className="item-list">
            {cvData.experiences.map((exp, index) => (
              <div key={index} className="item-card fade-in">
                <button
                  className="btn-remove"
                  onClick={() => removeExperience(index)}
                  aria-label="Remover experiência"
                  style={{ top: "15px", right: "15px" }}
                >
                  <FaTrash className="icon-sm" />
                </button>
                <div className="item-header">
                  <div className="item-content">
                    <div className="item-title">{exp.title}</div>
                    <div className="item-subtitle">{exp.company}</div>
                    <div className="item-date">
                      {exp.startDate} - {exp.current ? "Atual" : exp.endDate}
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <div className="item-description">{exp.description}</div>
                )}
              </div>
            ))}
          </div>

          {errors.experience && (
            <div className="error-message" style={{ marginBottom: "1rem" }}>
              <FaExclamationTriangle className="icon-sm" />
              {errors.experience}
            </div>
          )}

          <div className="add-form">
            <h4 className="add-form-title">
              <FaPlus className="icon-md" />
              Adicionar Experiência
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="required-field">Cargo</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      title: e.target.value,
                    })
                  }
                  placeholder="Ex: Desenvolvedor Frontend"
                />
              </div>
              <div className="form-group">
                <label className="required-field">Empresa</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      company: e.target.value,
                    })
                  }
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExperience.startDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setNewExperience({
                      ...newExperience,
                      startDate: formatted,
                    });
                  }}
                  placeholder="MM/AAAA"
                  maxLength={7}
                />
                {!validateDate(newExperience.startDate) &&
                  newExperience.startDate && (
                    <div className="error-message">
                      <FaExclamationTriangle className="icon-sm" />
                      Formato inválido. Use MM/AAAA
                    </div>
                  )}
              </div>
              <div className="form-group">
                <label>Data de Término</label>
                <input
                  type="text"
                  className="form-control"
                  value={newExperience.endDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setNewExperience({
                      ...newExperience,
                      endDate: formatted,
                    });
                  }}
                  placeholder="MM/AAAA ou 'Atual'"
                  disabled={newExperience.current}
                  maxLength={7}
                />
                {!validateDate(newExperience.endDate) &&
                  newExperience.endDate &&
                  !newExperience.current && (
                    <div className="error-message">
                      <FaExclamationTriangle className="icon-sm" />
                      Formato inválido. Use MM/AAAA
                    </div>
                  )}
              </div>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="currentJob"
                checked={newExperience.current}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : newExperience.endDate,
                  })
                }
              />
              <label htmlFor="currentJob">Emprego atual</label>
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                className="form-control"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                placeholder="Descreva suas responsabilidades, conquistas e tecnologias utilizadas..."
                rows="3"
              />
            </div>
            <button
              onClick={handleAddExperience}
              className="btn btn-primary"
              disabled={!newExperience.title || !newExperience.company}
            >
              <FaPlus className="icon-md" />
              <span>Adicionar Experiência</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formação Acadêmica - CORRIGIDO: formatação automática de data */}
      <div className="section-collapsible">
        <SectionHeader
          title="Formação Acadêmica"
          icon={<FaGraduationCap className="icon-md" />}
          isCompleted={completedSections.education}
          isExpanded={expandedSections.education}
          onToggle={() => toggleSection("education")}
        >
          {!completedSections.education && (
            <FaCircle className="section-incomplete" />
          )}
        </SectionHeader>

        <div
          className={`section-content ${
            expandedSections.education ? "" : "collapsed"
          }`}
        >
          {cvData.education.length === 0 && (
            <div className="empty-section">
              <FaGraduationCap className="empty-icon" />
              <h4>Nenhuma formação adicionada</h4>
              <p>Adicione sua formação acadêmica e cursos relevantes</p>
            </div>
          )}

          <div className="item-list">
            {cvData.education.map((edu, index) => (
              <div key={index} className="item-card fade-in">
                <button
                  className="btn-remove"
                  onClick={() => removeEducation(index)}
                  aria-label="Remover formação"
                  style={{ top: "15px", right: "15px" }}
                >
                  <FaTrash className="icon-sm" />
                </button>
                <div className="item-header">
                  <div className="item-content">
                    <div className="item-title">{edu.degree}</div>
                    <div className="item-subtitle">{edu.institution}</div>
                    <div className="item-date">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
                {edu.description && (
                  <div className="item-description">{edu.description}</div>
                )}
              </div>
            ))}
          </div>

          {errors.education && (
            <div className="error-message" style={{ marginBottom: "1rem" }}>
              <FaExclamationTriangle className="icon-sm" />
              {errors.education}
            </div>
          )}

          <div className="add-form">
            <h4 className="add-form-title">
              <FaPlus className="icon-md" />
              Adicionar Formação
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="required-field">Curso/Grau</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                  placeholder="Ex: Bacharelado em Ciência da Computação"
                />
              </div>
              <div className="form-group">
                <label className="required-field">Instituição</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEducation.institution}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      institution: e.target.value,
                    })
                  }
                  placeholder="Nome da instituição"
                />
              </div>
              <div className="form-group">
                <label>Data de Início</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEducation.startDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setNewEducation({
                      ...newEducation,
                      startDate: formatted,
                    });
                  }}
                  placeholder="MM/AAAA"
                  maxLength={7}
                />
                {!validateDate(newEducation.startDate) &&
                  newEducation.startDate && (
                    <div className="error-message">
                      <FaExclamationTriangle className="icon-sm" />
                      Formato inválido. Use MM/AAAA
                    </div>
                  )}
              </div>
              <div className="form-group">
                <label>Data de Término</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEducation.endDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setNewEducation({
                      ...newEducation,
                      endDate: formatted,
                    });
                  }}
                  placeholder="MM/AAAA"
                  maxLength={7}
                />
                {!validateDate(newEducation.endDate) &&
                  newEducation.endDate && (
                    <div className="error-message">
                      <FaExclamationTriangle className="icon-sm" />
                      Formato inválido. Use MM/AAAA
                    </div>
                  )}
              </div>
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                className="form-control"
                value={newEducation.description}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    description: e.target.value,
                  })
                }
                placeholder="Detalhes adicionais sobre a formação, disciplinas relevantes, TCC..."
                rows="3"
              />
            </div>
            <button
              onClick={handleAddEducation}
              className="btn btn-primary"
              disabled={!newEducation.degree || !newEducation.institution}
            >
              <FaPlus className="icon-md" />
              <span>Adicionar Formação</span>
            </button>
          </div>
        </div>
      </div>

      {/* IDIOMAS */}
      <div className="section-collapsible">
        <SectionHeader
          title="Idiomas"
          icon={<FaLanguage className="icon-md" />}
          isCompleted={completedSections.languages}
          isExpanded={expandedSections.languages}
          onToggle={() => toggleSection("languages")}
        >
          {!completedSections.languages && (
            <FaCircle className="section-incomplete" />
          )}
        </SectionHeader>

        <div
          className={`section-content ${
            expandedSections.languages ? "" : "collapsed"
          }`}
        >
          {(!cvData.languages || cvData.languages.length === 0) && (
            <div className="empty-section">
              <FaLanguage className="empty-icon" />
              <h4>Nenhum idioma adicionado</h4>
              <p>
                Idiomas são um diferencial importante no mercado de trabalho
              </p>
            </div>
          )}

          <div className="languages-grid">
            {cvData.languages &&
              cvData.languages.map((lang, index) => (
                <div key={index} className="language-card fade-in">
                  <div className="language-header">
                    <div className="language-name">
                      <FaLanguage className="icon-sm" />
                      {lang.language}
                    </div>
                    <button
                      className="language-remove"
                      onClick={() => removeLanguage(index)}
                      aria-label={`Remover ${lang.language}`}
                      title="Remover idioma"
                    >
                      <FaTrash className="icon-sm" />
                    </button>
                  </div>
                  <LanguageLevelIndicator level={lang.level} />
                  <div className="language-description">
                    {
                      levelOptions.find((l) => l.value === lang.level)
                        ?.description
                    }
                  </div>
                </div>
              ))}
          </div>

          {errors.language && (
            <div className="error-message" style={{ marginBottom: "1rem" }}>
              <FaExclamationTriangle className="icon-sm" />
              {errors.language}
            </div>
          )}

          <div className="add-form">
            <h4 className="add-form-title">
              <FaPlus className="icon-md" />
              Adicionar Idioma
            </h4>

            <div className="language-form-grid">
              <div className="form-group">
                <label className="required-field">Idioma</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    value={newLanguage.language}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        language: e.target.value,
                      })
                    }
                    list="language-options"
                    placeholder="Digite o idioma..."
                    autoComplete="off"
                  />
                  <datalist id="language-options">
                    {languageOptions
                      .filter(
                        (lang) =>
                          newLanguage.language &&
                          lang
                            .toLowerCase()
                            .includes(newLanguage.language.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((lang) => (
                        <option key={lang} value={lang} />
                      ))}
                  </datalist>
                </div>
                <div className="input-hint">
                  Comece a digitar para ver sugestões (ex: digite "I" para ver
                  Inglês, Italiano, etc.)
                </div>
              </div>

              <div className="form-group">
                <label className="required-field">Nível de Proficiência</label>
                <select
                  className="form-control"
                  value={newLanguage.level}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, level: e.target.value })
                  }
                >
                  <option value="">Selecione o nível</option>
                  {levelOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {newLanguage.level && (
                  <div className="level-description">
                    {
                      levelOptions.find((l) => l.value === newLanguage.level)
                        ?.description
                    }
                  </div>
                )}
              </div>
            </div>

            <div className="language-level-guide">
              <h5>Guia de Níveis:</h5>
              <div className="level-guide-grid">
                {levelOptions.map((level) => (
                  <div key={level.value} className="level-guide-item">
                    <LanguageLevelIndicator level={level.value} />
                    <span>{level.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddLanguage}
              className="btn btn-primary"
              disabled={!newLanguage.language || !newLanguage.level}
            >
              <FaPlus className="icon-md" />
              <span>Adicionar Idioma</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORREÇÃO: Habilidades com lixeira vermelha igual às outras */}
      <div className="section-collapsible">
        <SectionHeader
          title="Habilidades"
          icon={<FaBolt className="icon-md" />}
          isCompleted={completedSections.skills}
          isExpanded={expandedSections.skills}
          onToggle={() => toggleSection("skills")}
        >
          {!completedSections.skills && (
            <FaCircle className="section-incomplete" />
          )}
        </SectionHeader>

        <div
          className={`section-content ${
            expandedSections.skills ? "" : "collapsed"
          }`}
        >
          {cvData.skills.length === 0 && (
            <div className="empty-section">
              <FaBolt className="empty-icon" />
              <h4>Nenhuma habilidade adicionada</h4>
              <p>Adicione suas habilidades técnicas e comportamentais</p>
            </div>
          )}

          <div className="skills-list">
            {cvData.skills.map((skill, index) => (
              <div key={index} className="skill-item-card fade-in">
                <div className="skill-item-content">
                  <span className="skill-item-text">{skill}</span>
                  <button
                    className="skill-item-remove"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remover ${skill}`}
                    title="Remover habilidade"
                  >
                    <FaTrash className="icon-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="skill-input-section">
            <div className="skill-input">
              <input
                type="text"
                className="form-control"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma habilidade (Ex: JavaScript, React, Gestão de Projetos...)"
              />
              <button
                onClick={handleAddSkill}
                className="btn btn-primary"
                disabled={!newSkill.trim()}
              >
                <FaPlus className="icon-md" />
                <span>Adicionar</span>
              </button>
            </div>
            <div className="skill-tips">
              <p>
                💡 <strong>Dica:</strong> Pressione Enter ou clique em Adicionar
              </p>
              <p>🎯 Separe habilidades técnicas e comportamentais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVForm;
