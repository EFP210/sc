// src/pages/api/report/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { auth, firestore } from '@/config/firebase';
import { Parser } from 'json2csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { uids } = req.body;

    if (!uids || !Array.isArray(uids)) {
      return res.status(400).json({ error: 'UIDs no válidos o faltantes' });
    }

    try {
      const usersData = await Promise.all(
        uids.map(async (uid: string) => {
          const userRecord = await auth.getUser(uid).catch(() => null);
          if (!userRecord) return { UID: uid, Correo: 'No encontrado', Registrado: 'No' };

          const entrenamientoRef = firestore.doc(`usuarios/${uid}/entrenamientos/entrenatusupercerebro`);
          const entrenamientoSnapshot = await entrenamientoRef.get();
          const entrenamientoData = entrenamientoSnapshot.exists ? entrenamientoSnapshot.data() : null;

          return {
            UID: uid,
            Correo: userRecord.email || 'No encontrado',
            Registrado: 'Sí',
            Entrenamiento: entrenamientoData ? 'Sí' : 'No',
            'Primer Login': entrenamientoData?.primerLogin ? 'Sí' : 'No',
            'Ingresado Entrenamiento': entrenamientoData ? 'Sí' : 'No',
            'Sesiones Completadas': entrenamientoData?.sesionesCompletadas ?? 'N.A',
            'Actividades Completadas': entrenamientoData?.actividadesCompletadas ?? 'N.A',
            'Entrenamiento Completado': entrenamientoData?.completadoEntrenamiento ? 'Sí' : 'No',
            'Inicio Entrenamiento': entrenamientoData?.fechaInicio?.toDate().toLocaleDateString() ?? 'N.A',
            'Fecha Última Sesión': entrenamientoData?.fechaUltimaSesion?.toDate().toLocaleDateString() ?? 'N.A',
          };
        })
      );

      // Convertir datos a CSV usando json2csv
      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(usersData);

      // Configurar la respuesta para descargar el archivo CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_usuarios.csv');
      res.status(200).send(csvData);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      res.status(500).json({ error: 'Error al generar el reporte' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
