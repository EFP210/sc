import React, { useState } from 'react';
import TemplateSelector from './components/TemplateSelector';
import Papa from 'papaparse';
import styles from './TwilioForm.module.css';

const TwilioForm = () => {
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [numbers, setNumbers] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [messagePreview, setMessagePreview] = useState(''); // Estado para la vista previa del mensaje

    const validateInputs = () => {
        if (!selectedTemplateId) {
            setError('Por favor, selecciona una plantilla.');
            return false;
        }
        if (!numbers.trim()) {
            setError('Por favor, ingresa al menos un número.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const phoneNumbers = results.data.map((row: any) => row.Telefonos?.trim()).filter(Boolean);
                setNumbers(phoneNumbers.join(', ')); // Actualiza el estado de números
            },
            error: (error) => {
                console.error('Error al procesar el archivo CSV:', error);
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInputs()) return;

        const numbersArray = numbers.split(',').map((num) => num.trim());

        try {
            const response = await fetch('/api/twilio/sendMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ templateId: selectedTemplateId, numbers: numbersArray }),
            });

            if (response.ok) {
                alert('Mensajes enviados con éxito');
                setNumbers('');
            } else {
                alert('Error al enviar mensajes');
            }
        } catch (error) {
            console.error('Error al enviar mensajes:', error);
        }
    };

    return (
<div className={styles.container}>
    <h1 className={styles.title}>Envío de Mensajes Masivos</h1>
    <form onSubmit={handleSubmit} className={styles.form}>
        <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
            onTemplateEdit={setMessagePreview}
        />
        <div className={styles.inputGroup}>
            <label htmlFor="numbers">Números (separados por coma):</label>
            <textarea
                id="numbers"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                className={styles.textarea}
                placeholder="Ej: +1234567890, +0987654321"
            />
        </div>
        <div className={styles.inputGroup}>
            <label htmlFor="fileInput">Cargar números desde CSV:</label>
            <input
                id="fileInput"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className={styles.fileInput}
            />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
            Enviar Mensajes
        </button>
    </form>
</div>

    );
};

export default TwilioForm;
