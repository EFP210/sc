import Twilio from 'twilio/lib/rest/Twilio';

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function enviarMensajesTwilio(numbers: string[], templateId: string) {
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

    await Promise.all(responses);
}

export async function obtenerPlantillasTwilio() {
    try {
        // Verificamos que TWILIO_MESSAGING_SERVICE_SID esté definido
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
        if (!messagingServiceSid) {
            throw new Error("TWILIO_MESSAGING_SERVICE_SID no está definido en el archivo .env");
        }

        // Intentamos acceder a las plantillas
        const templates = await client.messaging.v1
            .services(messagingServiceSid)
            .content
            .list();

        if (!templates) {
            throw new Error("No se encontraron plantillas de contenido");
        }

        // Filtramos y formateamos solo la información relevante de las plantillas
        return templates.map((template) => ({
            sid: template.sid,
            friendlyName: template.friendlyName,
        }));
    } catch (error) {
        console.error("Error al obtener plantillas de Twilio:", error);
        throw error; // Devolvemos el error para ser manejado en el llamado
    }
}

