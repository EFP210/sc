// src/components/ReportUploader/ReportUploader.tsx
import React, { useState } from 'react';
import Papa from 'papaparse';

export default function ReportUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  type CSVRow = { UID: string }; // Define el tipo esperado para cada fila del CSV
  
  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo CSV.');
      return;
    }
  
    setError(null);
  
    Papa.parse<CSVRow>(file, {
      header: true, // Espera encabezados en el CSV
      skipEmptyLines: true,
      complete: async (results) => {
        const uids = results.data.map((row) => row.UID.trim()); // Usa el tipo `CSVRow` para `row`
  
        try {
          const response = await fetch('/api/report/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uids }),
          });
  
          if (!response.ok) throw new Error('Error al generar el reporte');
  
          // Procesa la respuesta aquí si es necesario
        } catch (error) {
          console.error('Error al enviar los datos:', error);
        }
      },
      error: (err) => {
        console.error('Error al procesar el archivo CSV:', err);
        setError('Error al procesar el archivo CSV');
      },
    });
  };
  

  return (
    <div>
      <h1>Subir Archivo CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Generar Reporte</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
