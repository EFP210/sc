import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/config/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const trainingsSnapshot = await firestore.collection('entrenamientos').get();
        const trainings = trainingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return res.status(200).json({ trainings });
    } catch (error) {
        console.error('Error fetching trainings:', error);
        return res.status(500).json({ error: 'Error fetching trainings' });
    }
}
