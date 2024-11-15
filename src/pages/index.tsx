// src/pages/index.tsx
import Link from 'next/link';

export default function HomePage() {
    return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '0.5em' }}>Bienvenido a la Aplicación de Mensajes Masivos</h1>
            <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '1.5em' }}>
                Esta aplicación te permite enviar mensajes masivos de manera eficiente y organizada usando la plataforma de Twilio.
                Navega a través del menú para acceder a las distintas funcionalidades que hemos preparado para ti.
            </p>
            <Link href="/twilio" style={{
                    padding: '10px 20px',
                    fontSize: '1.2em',
                    color: '#fff',
                    backgroundColor: '#0070f3',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005bb5')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
            >
                Ir a Mensajes Masivos
            </Link>
        </div>
    );
}
