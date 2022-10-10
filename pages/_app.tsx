import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import styles from '../styles/App.module.css';

import { GamersProvider } from '../contexts/gamers';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <GamersProvider>
        <Layout>
          <main className={styles.main}>
            <Component {...pageProps} />
          </main>
        </Layout>
      </GamersProvider>
    </SessionProvider>
  );
}

export default MyApp
