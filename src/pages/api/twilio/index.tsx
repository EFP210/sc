// src/pages/twilio/index.tsx
import { useState } from 'react';

const TwilioPage = () => {
    const [recipients, setRecipients] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSendMessages = async () => {
        try {
            const response = await fetch('/api/twilio/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: recipients.split(','), // Divide la lista de números
                    message,
                }),
            });

            if (response.ok) {
                alert('¡Mensajes enviados exitosamente!');
            } else {
                alert('Error al enviar mensajes');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div>
            <h1>Enviar Mensajes Masivos</h1>
            <textarea
                placeholder="Lista de números separados por coma"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
            />
            <textarea
                placeholder="Mensaje"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessages}>Enviar</button>
        </div>
    );
};

export default TwilioPage;
