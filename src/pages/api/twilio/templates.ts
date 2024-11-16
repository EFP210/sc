import { NextApiRequest, NextApiResponse } from 'next';
import { obtenerPlantillasTwilio } from '@/modules/twilio/services/twillioService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const templates = await obtenerPlantillasTwilio();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener plantillas de Twilio' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
