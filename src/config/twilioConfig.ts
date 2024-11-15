// src/config/twilioConfig.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;

export const twilioClient = twilio(accountSid, authToken);