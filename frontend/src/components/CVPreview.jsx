import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGraduationCap,
  FaBriefcase,
  FaBolt,
  FaGlobeAmericas,
  FaLanguage,
} from "react-icons/fa";

const CVPreview = ({ cvData }) => {
  const isEmpty =
    !cvData.name &&
    !cvData.email &&
    !cvData.title &&
    cvData.experiences.length === 0 &&
    cvData.education.length === 0 &&
    cvData.skills.length === 0 &&
    (!cvData.languages || cvData.languages.length === 0);

  if (isEmpty) {
    return (
      <div className="empty-state-preview">
        <div className="empty-state-preview-icon">
          <FaUser size={48} />
        </div>
        <h3>Currículo em Branco</h3>
        <p>
          Preencha as informações ao lado para ver a prévia do seu currículo
          profissional
        </p>
        <div className="empty-state-tips">
          <p>💡 Comece pelas informações básicas (nome, título e email)</p>
          <p>🎯 Adicione experiências profissionais relevantes</p>
          <p>📚 Inclua sua formação acadêmica</p>
          <p>⚡ Destaque suas habilidades principais</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <div className="profile-section">
          <div className="photo-container">
            {cvData.photoUrl ? (
              <img
                src={cvData.photoUrl}
                className="photo"
                alt="Foto de perfil"
              />
            ) : (
              <div className="default-photo">
                <FaUser />
              </div>
            )}
          </div>
          <div className="info">
            <h1 className="name">{cvData.name || "[Seu Nome Completo]"}</h1>
            <div className="title">
              {cvData.title || "[Título Profissional]"}
            </div>
          </div>
        </div>
        <div className="contact-info">
          {cvData.email && (
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>{cvData.email}</span>
            </div>
          )}
          {cvData.phone && (
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>{cvData.phone}</span>
            </div>
          )}
          {cvData.location && (
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>{cvData.location}</span>
            </div>
          )}
          {cvData.linkedin && (
            <div className="contact-item">
              <FaLinkedin className="contact-icon" />
              <span>{cvData.linkedin}</span>
            </div>
          )}
          {cvData.lattes && (
            <div className="contact-item">
              <FaGraduationCap className="contact-icon" />
              <span>{cvData.lattes}</span>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>
          <FaUser className="section-icon" />
          RESUMO PROFISSIONAL
        </h3>
        {cvData.summary ? (
          <div className="description">{cvData.summary}</div>
        ) : (
          <div className="empty-state">
            Profissional dedicado e comprometido com excelência em todas as
            atividades desenvolvidas.
          </div>
        )}
      </div>

      <div className="two-column">
        <div className="column">
          {/* Experiência Profissional */}
          <div className="section">
            <h3>
              <FaBriefcase className="section-icon" />
              EXPERIÊNCIA PROFISSIONAL
            </h3>
            {cvData.experiences && cvData.experiences.length > 0 ? (
              cvData.experiences.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="job-title">
                    {exp.title || "Cargo não especificado"}
                  </div>
                  <div className="company">
                    {exp.company || "Empresa não especificada"}
                  </div>
                  <div className="date">
                    {exp.startDate || "Data não especificada"} -{" "}
                    {exp.current
                      ? "Atual"
                      : exp.endDate || "Data não especificada"}
                  </div>
                  {exp.description && (
                    <div className="description">{exp.description}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                Em busca da primeira oportunidade profissional.
              </div>
            )}
          </div>

          {/* Formação Acadêmica */}
          <div className="section">
            <h3>
              <FaGraduationCap className="section-icon" />
              FORMAÇÃO ACADÊMICA
            </h3>
            {cvData.education && cvData.education.length > 0 ? (
              cvData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="job-title">
                    {edu.degree || "Curso não especificado"}
                  </div>
                  <div className="company">
                    {edu.institution || "Instituição não especificada"}
                  </div>
                  <div className="date">
                    {edu.startDate || "Data não especificada"} -{" "}
                    {edu.endDate || "Data não especificada"}
                  </div>
                  {edu.description && (
                    <div className="description">{edu.description}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                Formação acadêmica em andamento.
              </div>
            )}
          </div>
        </div>

        <div className="column">
          {/* Idiomas */}
          {cvData.languages && cvData.languages.length > 0 && (
            <div className="section">
              <h3>
                <FaGlobeAmericas className="section-icon" />
                IDIOMAS
              </h3>
              <div className="languages">
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <div className="language-name">{lang.language}</div>
                    <div className="language-level">{lang.level}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habilidades */}
          <div className="section">
            <h3>
              <FaBolt className="section-icon" />
              HABILIDADES
            </h3>
            {cvData.skills && cvData.skills.length > 0 ? (
              <div className="skills">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Habilidades técnicas e comportamentais em desenvolvimento.
              </div>
            )}
          </div>

          {/* Links */}
          {(cvData.linkedin || cvData.lattes) && (
            <div className="section">
              <h3>LINKS</h3>
              <div className="links">
                {cvData.linkedin && (
                  <div className="link-item">
                    <FaLinkedin className="link-icon" />
                    LinkedIn: {cvData.linkedin}
                  </div>
                )}
                {cvData.lattes && (
                  <div className="link-item">
                    <FaGraduationCap className="link-icon" />
                    Lattes: {cvData.lattes}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
