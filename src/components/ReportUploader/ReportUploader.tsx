import React, { useState, useEffect } from "react";
import Papa from "papaparse";

type Training = {
  id: string;
  titulo: string;
  descripcion?: string;
};

type CSVRow = { UID: string };

export default function ReportUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  // Fetch trainings from backend
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const API_BASE_URL =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_API_URL
            : "http://localhost:3000";

        const response = await fetch(`${API_BASE_URL}/api/training`);
        if (!response.ok) throw new Error("Error al cargar los entrenamientos");
        const data = await response.json();
        setTrainings(data.trainings);
      } catch (error) {
        console.error(error);
        setError(
          "No se pudieron cargar los entrenamientos. Intenta nuevamente."
        );
      }
    };
    fetchTrainings();
  }, []);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo CSV.");
      return;
    }

    if (!selectedTraining) {
      setError("Por favor selecciona un entrenamiento.");
      return;
    }

    setError(null);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const uids = results.data.map((row) => row.UID?.trim());
        const API_BASE_URL =
          process.env.NODE_ENV === "production"
            ? process.env.API_BASE_URL
            : "http://localhost:3000";

        try {
          const response = await fetch(`${API_BASE_URL}/api/report/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uids, trainingId: selectedTraining }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al generar el reporte");
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "reporte.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error: unknown) {
          console.error(error);
          if (error instanceof Error) {
            setError(error.message || "Hubo un problema al generar el reporte.");
          } else {
            setError("Hubo un problema desconocido.");
          }
        }


      },
    });
  };


  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#6a1b9a",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Generador de Reportes
      </h1>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <label
          htmlFor="training-select"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Selecciona un entrenamiento:
        </label>
        <select
          id="training-select"
          value={selectedTraining || ""}
          onChange={(e) => setSelectedTraining(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            fontSize: "14px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <option value="" disabled>
            -- Seleccionar Entrenamiento --
          </option>
          {trainings.map((training) => (
            <option key={training.id} value={training.id}>
              {training.titulo}
            </option>
          ))}
        </select>

        <label
          htmlFor="file-upload"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Selecciona un archivo CSV:
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            marginBottom: "20px",
            padding: "5px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            backgroundColor: "#6a1b9a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Generar y Descargar Reporte
        </button>
        {error && (
          <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
