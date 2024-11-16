import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/config/firebase';
import { Parser } from 'json2csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[LOG]: Nueva solicitud ${req.method} en /api/report/generate`);

  if (req.method === 'POST') {
    const { uids, trainingId } = req.body;

    console.log(`[LOG]: Datos recibidos - trainingId: ${trainingId}, uids: ${uids}`);

    if (!trainingId) {
      console.error('[ERROR]: Training ID no proporcionado');
      return res.status(400).json({ error: 'Training ID es requerido' });
    }

    if (!uids || !Array.isArray(uids)) {
      console.error('[ERROR]: UIDs no válidos o faltantes');
      return res.status(400).json({ error: 'UIDs no válidos o faltantes' });
    }

    try {
      // Validar si el entrenamiento existe
      const trainingRef = firestore.doc(`entrenamientos/${trainingId}`);
      console.log(`[LOG]: Consultando entrenamiento en ruta: entrenamientos/${trainingId}`);

      const trainingDoc = await trainingRef.get();
      if (!trainingDoc.exists) {
        console.error('[ERROR]: Entrenamiento no válido');
        return res.status(400).json({ error: 'Entrenamiento no válido' });
      }

      const usersData = await Promise.all(
        uids.map(async (uid: string) => {
          console.log(`[LOG]: Procesando usuario con UID: ${uid}`);
      
          // Consultar el documento del entrenamiento en Firestore
          const entrenamientoRef = firestore.doc(
            `entrenamientos/entrenatusupercerebro/registro_entrenamiento/${uid}`
          );
          console.log(`[LOG]: Consultando datos en ruta: entrenamientos/entrenatusupercerebro/registro_entrenamiento/${uid}`);
      
          const entrenamientoSnapshot = await entrenamientoRef.get();
          const entrenamientoData = entrenamientoSnapshot.exists ? entrenamientoSnapshot.data() : null;
      
          if (!entrenamientoData) {
            console.warn(`[WARN]: Entrenamiento no encontrado para UID: ${uid}`);
            return {
              UID: uid,
              Nombre: 'No encontrado',
              'Teléfono Completo': 'No disponible',
              'Completado Entrenamiento': 'No',
              'Completado Sesión': 'No',
              'Fecha Inicio Entrenamiento': 'N.A',
              'Última Fecha de Sesión': 'N.A',
              'Orden de Sesión': 'N.A',
            };
          }
      
          console.log(`[LOG]: Datos encontrados para UID ${uid}: ${JSON.stringify(entrenamientoData)}`);
      
          return {
            UID: uid,
            Nombre: entrenamientoData.nombre || 'No encontrado',
            'Teléfono Completo': entrenamientoData.telefonoCompleto || 'No disponible',
            'Completado Entrenamiento': entrenamientoData.completadoEntrenamiento ? 'Sí' : 'No',
            'Completado Sesión': entrenamientoData.completadoSesion ? 'Sí' : 'No',
            'Fecha Inicio Entrenamiento': entrenamientoData.fechaInicio
              ? new Date(entrenamientoData.fechaInicio._seconds * 1000).toLocaleDateString()
              : 'N.A',
            'Última Fecha de Sesión': entrenamientoData.fechaSesion
              ? new Date(entrenamientoData.fechaSesion._seconds * 1000).toLocaleDateString()
              : 'N.A',
            'Orden de Sesión': entrenamientoData.ordenSesion ?? 'N.A',
          };
        })
      );
      


      console.log(`[LOG]: Datos de usuarios procesados: ${JSON.stringify(usersData)}`);

      // Convertir datos a CSV usando json2csv
      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(usersData);

      console.log('[LOG]: Datos CSV generados correctamente');

      // Configurar la respuesta para descargar el archivo CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_usuarios.csv');
      res.status(200).send(csvData);
    } catch (error) {
      console.error('[ERROR]: Error al generar el reporte', error);
      res.status(500).json({ error: 'Error al generar el reporte' });
    }
  } else {
    console.error(`[ERROR]: Método ${req.method} no permitido`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
