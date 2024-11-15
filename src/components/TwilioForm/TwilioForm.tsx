import React, { useState } from 'react';
import styles from './TwilioForm.module.css';
import TemplateSelector from './components/TemplateSelector';

const TwilioForm = () => {
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [numbers, setNumbers] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numbersArray = numbers.split(',').map((num) => num.trim());

        const response = await fetch('/api/twilio/sendMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ templateId: selectedTemplateId, numbers: numbersArray }),
        });

        if (response.ok) {
            alert('Mensajes enviados con éxito');
        } else {
            alert('Error al enviar mensajes');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Envío de Mensajes Masivos</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <TemplateSelector selectedTemplateId={selectedTemplateId} setSelectedTemplateId={setSelectedTemplateId} />
                <div className={styles.inputGroup}>
                    <label>Números (separados por coma):</label>
                    <textarea
                        value={numbers}
                        onChange={(e) => setNumbers(e.target.value)}
                        className={styles.textarea}
                    />
                </div>
                <button type="submit" className={styles.button}>Enviar Mensajes</button>
            </form>
        </div>
    );
};

export default TwilioForm;
