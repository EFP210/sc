// src/components/Menu/Menu.tsx
import Link from 'next/link';
import styles from './Menu.module.css';

const Menu = () => {
    return (
        <nav className={styles.menu}>
            <Link href="/">Inicio</Link>
            <Link href="/twilio">Mensajes Masivos</Link>
            <Link href="/report">Reporte</Link>
        </nav>
    );
};

export default Menu;
