import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { GamersProvider } from '../contexts/gamers';

import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GamersProvider>
      <div className={styles.container}>
        <Head>
          <title>The Real Pachi Patch</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Component {...pageProps} />
        </main>
      </div>
    </GamersProvider>
  );
}

export default MyApp
