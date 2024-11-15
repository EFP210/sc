// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Menu from '../components/Menu/Menu';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Menu />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
