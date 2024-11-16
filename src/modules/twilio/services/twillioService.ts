import Twilio from 'twilio/lib/rest/Twilio';

// Configuración del cliente de Twilio
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Función para enviar mensajes con una plantilla
export async function enviarMensajesTwilio(numbers: string[], templateId: string) {
  if (!process.env.TWILIO_MESSAGING_SERVICE_SID || !process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("Las variables de entorno necesarias no están definidas.");
  }

  const responses = numbers.map(async (number) => {
    try {
      return await client.messages.create({
        contentSid: templateId,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${number}`,
      });
    } catch (error) {
      console.error(`Error al enviar mensaje a ${number}:`, error);
      return null;
    }
  });

  return await Promise.all(responses);
}


export async function obtenerPlantillasTwilio() {
  try {
    // Llamada a la API de contenido
    const templates = await client.content.v1.contentAndApprovals.list();

    if (!templates || templates.length === 0) {
      throw new Error('No se encontraron plantillas de contenido');
    }

    console.log(templates);
    // Devuelve un arreglo de plantillas con la información relevante
    return templates.map((template) => ({
      sid: template.sid,
      friendlyName: template.friendlyName,
      dateCreated: template.dateCreated,
    }));

  } catch (error) {
    console.error('Error al obtener plantillas de Twilio:', error);
    throw error;
  }
}

