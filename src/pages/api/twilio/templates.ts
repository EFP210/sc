import { NextApiRequest, NextApiResponse } from 'next';
import { obtenerPlantillasTwilio } from '@/modules/twilio/services/twillioService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Cambiar '*' por un dominio específico si es necesario
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejo de solicitudes preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const templates = await obtenerPlantillasTwilio();

      // Respuesta con las plantillas obtenidas
      res.status(200).json(templates);
    } catch (error) {
      console.error('[ERROR]: Error al obtener plantillas de Twilio:', error);
      res.status(500).json({
        error: 'Error al obtener plantillas de Twilio',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    // Manejo de métodos no permitidos
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
