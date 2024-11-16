import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/config/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite solicitudes desde cualquier origen (*). Cambiar por un dominio específico si es necesario.
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos

    // Manejo de solicitudes preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Validar el método HTTP
    if (req.method !== 'GET') {
        return res
            .setHeader('Allow', ['GET'])
            .status(405)
            .end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Obtener entrenamientos de Firestore
        const trainingsSnapshot = await firestore.collection('entrenamientos').get();
        const trainings = trainingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Responder con los datos obtenidos
        return res.status(200).json({ trainings });
    } catch (error) {
        console.error('Error fetching trainings:', error);
        return res.status(500).json({ error: 'Error fetching trainings' });
    }
}
