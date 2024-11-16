import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Activa el modo estricto de React
  swcMinify: true,       // Utiliza SWC para minificación más rápida
  output: 'standalone',  // Asegura la compatibilidad con entornos serverless

  // Configuración personalizada de Webpack
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          http2: false,
          dgram: false,
          process: false,
        },
      };
    }
    return config;
  },

  // Variables de entorno
  env: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    TWILIO_MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    FIREBASE_API_KEY_DEV: process.env.FIREBASE_API_KEY_DEV,
    FIREBASE_AUTH_DOMAIN_DEV: process.env.FIREBASE_AUTH_DOMAIN_DEV,
    FIREBASE_PROJECT_ID_DEV: process.env.FIREBASE_PROJECT_ID_DEV,
    FIREBASE_STORAGE_BUCKET_DEV: process.env.FIREBASE_STORAGE_BUCKET_DEV,
    FIREBASE_MESSAGING_SENDER_ID_DEV: process.env.FIREBASE_MESSAGING_SENDER_ID_DEV,
    FIREBASE_APP_ID_DEV: process.env.FIREBASE_APP_ID_DEV,
    FIREBASE_MEASUREMENT_ID_DEV: process.env.FIREBASE_MEASUREMENT_ID_DEV,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EPAYCO_KEY: process.env.EPAYCO_KEY,
    EPAYCO_TEST: process.env.EPAYCO_TEST,
    EPAYCO_URL_RESPONSE: process.env.EPAYCO_URL_RESPONSE,
    PAYCO_URL_CONFIRMATION: process.env.PAYCO_URL_CONFIRMATION,
    EPAYCO_TEST_DEV: process.env.EPAYCO_TEST_DEV,
    EPAYCO_URL_RESPONSE_DEV: process.env.EPAYCO_URL_RESPONSE_DEV,
    EPAYCO_URL_CONFIRMATION_DEV: process.env.EPAYCO_URL_CONFIRMATION_DEV,
    FIREBASE_STORAGE_URL: process.env.FIREBASE_STORAGE_URL,
    FIREBASE_STORAGE_URL_DEV: process.env.FIREBASE_STORAGE_URL_DEV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Asegúrate de definir esta variable
  },
};

export default nextConfig;
