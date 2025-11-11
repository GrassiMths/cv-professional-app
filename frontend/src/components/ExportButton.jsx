import { useState } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";

const ExportButton = ({ cvData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validateCV = () => {
    const errors = [];

    if (!cvData.name?.trim()) {
      errors.push("Nome completo é obrigatório");
    }

    if (!cvData.email?.trim()) {
      errors.push("Email é obrigatório");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.email)) {
      errors.push("Email inválido");
    }

    if (!cvData.title?.trim()) {
      errors.push("Título profissional é obrigatório");
    }

    return errors;
  };

  const generatePdf = async () => {
    const validationErrors = validateCV();

    if (validationErrors.length > 0) {
      alert(
        `Por favor, corrija os seguintes erros:\n\n${validationErrors.join(
          "\n"
        )}`
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("PDF vazio recebido");
      }

      if (blob.type !== "application/pdf") {
        throw new Error("Tipo de arquivo inválido");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      const fileName = `${cvData.name.replace(/\s+/g, "_")}_Curriculo.pdf`;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert(
        `Erro ao gerar PDF: ${error.message}\n\nVerifique se o servidor backend está rodando na porta 4000.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = cvData.name && cvData.email && cvData.title;

  return (
    <button
      onClick={generatePdf}
      disabled={isLoading || !isFormValid}
      className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`}
      style={{ position: "relative" }}
    >
      {isLoading ? (
        <>
          <FaSpinner className="icon-md" />
          <span>Gerando PDF...</span>
        </>
      ) : (
        <>
          <FaDownload className="icon-md" />
          <span>Baixar PDF</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;
