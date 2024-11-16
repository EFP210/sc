import { NextApiRequest, NextApiResponse } from 'next';
import { enviarMensajesTwilio } from '@/modules/twilio/services/twillioService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Cambiar '*' por un dominio específico si es necesario
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejo de solicitudes preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Validar método HTTP
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }

    const { templateId, mensajePersonalizado, numbers } = req.body;

    // Validación de campos
    if ((!templateId && !mensajePersonalizado) || !numbers) {
        return res
            .status(400)
            .json({ error: 'Template ID o mensaje personalizado y números son requeridos.' });
    }

    try {
        // Lógica de envío de mensajes
        if (templateId) {
            await enviarMensajesTwilio(numbers, templateId);
        } else if (mensajePersonalizado) {
            await enviarMensajesTwilio(numbers, mensajePersonalizado);
        }

        return res.status(200).json({ message: 'Mensajes enviados con éxito' });
    } catch (error) {
        console.error('[ERROR]: Error al enviar mensajes:', error);
        return res.status(500).json({ error: 'Error al enviar mensajes' });
    }
}
