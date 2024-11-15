// src/components/TwilioForm/TemplateSelector.tsx

import React, { useEffect, useState } from 'react';

interface Template {
    sid: string;
    friendlyName: string;
}

interface TemplateSelectorProps {
    selectedTemplateId: string;
    setSelectedTemplateId: (id: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplateId, setSelectedTemplateId }) => {
    const [plantillas, setPlantillas] = useState<Template[]>([]);

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

    return (
        <div>
            <label>Selecciona una plantilla:</label>
            <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
                {plantillas.map((template) => (
                    <option key={template.sid} value={template.sid}>
                        {template.friendlyName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TemplateSelector;
