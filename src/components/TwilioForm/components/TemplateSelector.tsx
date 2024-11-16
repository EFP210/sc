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
  onTemplateEdit: (body: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  setSelectedTemplateId,
  onTemplateEdit,
}) => {
  const [plantillas, setPlantillas] = useState<Template[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/twilio/templates');
        if (response.ok) {
          const data = await response.json();
          setPlantillas(data);
        } else {
          console.error('Error al obtener las plantillas');
        }
      } catch (error) {
        console.error('Error en la solicitud de plantillas:', error);
      }
    };

    fetchTemplates();
  }, []);


  const getTemplateBody = (template: Template): string | null => {
    const types = template.types || {};

    if (types['twilio/text']?.body) {
        return types['twilio/text'].body;
    } else if (types['twilio/card']?.title) {
        return types['twilio/card'].title;
    }

    return 'No hay cuerpo disponible para esta plantilla.';
};

  
  const selectedTemplate = plantillas.find((template) => template.sid === selectedTemplateId);

  useEffect(() => {
    if (selectedTemplate) {
        const templateBody = getTemplateBody(selectedTemplate);
        const updatedBody = templateBody?.replace(/\{\{(\d+)\}\}/g, (_, match) => variables[match] || `{{${match}}}`);
        onTemplateEdit(updatedBody || '');
    }
}, [selectedTemplate, variables]);

  return (
    <div>
      <h2>Selecciona una Plantilla</h2>
      <div className={styles.templateContainer}>
        {plantillas.map((template) => (
          <div
            key={template.sid}
            className={`${styles.templateCard} ${
              selectedTemplateId === template.sid ? styles.selected : ''
            }`}
            onClick={() => {
              setSelectedTemplateId(template.sid);
              setVariables({}); // Limpiar variables al cambiar de plantilla
            }}
          >
            <h3>{template.friendlyName}</h3>
            <p>
              <strong>Idioma:</strong> {template.language}
            </p>
            <p>
              <strong>Creada:</strong> {new Date(template.dateCreated).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
