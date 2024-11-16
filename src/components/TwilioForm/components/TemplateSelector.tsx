import React, { useEffect, useState } from 'react';
import styles from './TemplateSelector.module.css';

interface Template {
  sid: string;
  friendlyName: string;
  dateCreated: string;
  language: string;
  types: {
    'twilio/text'?: {
      body: string | null;
    };
    'twilio/card'?: {
      title: string | null;
      body?: string | null; // Opcional
    };
  };
}

interface TemplateSelectorProps {
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  setSelectedTemplateId,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Configuración de la base de URL según el entorno
  const API_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL // Variable de entorno para producción
      : 'http://localhost:3000'; // Base de URL para desarrollo

  // Fetch templates desde el backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/twilio/templates`);
        if (!response.ok) {
          throw new Error('Error al obtener las plantillas. Intenta nuevamente.');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error('Error al obtener las plantillas:', err);
        setError((err as Error).message);
      }
    };

    fetchTemplates();
  }, [API_BASE_URL]);

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const selectedTemplate = templates.find((template) => template.sid === selectedTemplateId);

  return (
    <div>
      <h2>Selecciona una Plantilla</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <div className={styles.templateContainer}>
        {templates.length > 0 ? (
          templates.map((template) => (
            <div
              key={template.sid}
              className={`${styles.templateCard} ${
                selectedTemplateId === template.sid ? styles.selected : ''
              }`}
              onClick={() => handleTemplateClick(template.sid)}
            >
              <h3>{template.friendlyName}</h3>
              <p>
                <strong>Idioma:</strong> {template.language || 'Desconocido'}
              </p>
              <p>
                <strong>Creada:</strong> {new Date(template.dateCreated).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No se encontraron plantillas. Intenta nuevamente.</p>
        )}
      </div>
      {selectedTemplate && (
        <div className={styles.templateDetails}>
          <h3>Detalles de la Plantilla Seleccionada</h3>
          <p>
            <strong>ID:</strong> {selectedTemplate.sid}
          </p>
          <p>
            <strong>Nombre:</strong> {selectedTemplate.friendlyName}
          </p>
          <p>
            <strong>Idioma:</strong> {selectedTemplate.language}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{' '}
            {new Date(selectedTemplate.dateCreated).toLocaleDateString()}
          </p>
          {selectedTemplate.types['twilio/text']?.body && (
            <p>
              <strong>Cuerpo del Mensaje:</strong> {selectedTemplate.types['twilio/text']?.body}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
