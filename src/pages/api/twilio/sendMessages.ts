import { NextApiRequest, NextApiResponse } from 'next';
import { enviarMensajesTwilio } from '@/modules/twilio/services/twillioService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { templateId, mensajePersonalizado, numbers } = req.body;

        // Validación: al menos uno de los dos campos `templateId` o `mensajePersonalizado` debe estar presente
        if ((!templateId && !mensajePersonalizado) || !numbers) {
            return res.status(400).json({ error: 'Template ID o mensaje personalizado y números son requeridos.' });
        }

        try {
            // Enviar mensaje basado en `templateId` o `mensajePersonalizado`
            if (templateId) {
                await enviarMensajesTwilio(numbers, templateId);
            }
            
            return res.status(200).json({ message: 'Mensajes enviados con éxito' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al enviar mensajes' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
