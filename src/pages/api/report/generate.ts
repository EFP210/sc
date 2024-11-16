import { NextApiRequest, NextApiResponse } from 'next';
import { auth, firestore } from '@/config/firebase';
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
          const entrenamientoRef = firestore.doc(`entrenamientos/entrenatusupercerebro/registro_entrenamiento/${uid}`);
          console.log(`[LOG]: Consultando datos en ruta: entrenamientos/entrenatusupercerebro/registro_entrenamiento/${uid}`);

          const entrenamientoSnapshot = await entrenamientoRef.get();
          const entrenamientoData = entrenamientoSnapshot.exists ? entrenamientoSnapshot.data() : null;

          if (!entrenamientoData) {
            console.warn(`[WARN]: Entrenamiento no encontrado para UID: ${uid}`);
            return {
              UID: uid,
              Correo: 'No encontrado',
              Registrado: 'No',
              Entrenamiento: 'No',
              'Primer Login': 'N.A',
              'Ingresado Entrenamiento': 'N.A',
              'Sesiones Completadas': 'N.A',
              'Actividades Completadas': 'N.A',
              'Entrenamiento Completado': 'N.A',
              'Inicio Entrenamiento': 'N.A',
              'Fecha Última Sesión': 'N.A',
            };
          }

          console.log(`[LOG]: Datos encontrados para UID ${uid}: ${JSON.stringify(entrenamientoData)}`);

          return {
            UID: uid,
            Correo: entrenamientoData?.email || 'No encontrado',
            Registrado: entrenamientoData?.registrado ? 'Sí' : 'No Registrado',
            Entrenamiento: entrenamientoData ? 'Sí' : 'No',
            'Primer Login': entrenamientoData?.primerLogin ? 'Sí' : 'No',
            'Ingresado Entrenamiento': entrenamientoData?.ingresadoEntrenamiento ? 'Sí' : 'No',
            'Sesiones Completadas': entrenamientoData?.sesionesCompletadas ?? 'N.A',
            'Actividades Completadas': entrenamientoData?.actividadesCompletadas ?? 'N.A',
            'Entrenamiento Completado': entrenamientoData?.completadoEntrenamiento ? 'Sí' : 'No',
            'Inicio Entrenamiento': entrenamientoData?.fechaInicio?.toDate().toLocaleDateString() ?? 'N.A',
            'Fecha Última Sesión': entrenamientoData?.fechaUltimaSesion?.toDate().toLocaleDateString() ?? 'N.A',
          };
        }));


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
