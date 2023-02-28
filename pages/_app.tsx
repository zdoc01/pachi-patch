import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

import Layout from '../components/Layout';
import { UsersProvider } from '../contexts/users';

import styles from '../styles/App.module.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (endpoint, init) =>
          fetch(endpoint, init).then((res) => res.json()),
        refreshInterval: 10000,
      }}
    >
      <SessionProvider session={pageProps.session}>
        <UsersProvider>
          <Layout>
            <main className={styles.main}>
              <Component {...pageProps} />
            </main>
          </Layout>
        </UsersProvider>
      </SessionProvider>
    </SWRConfig>
  );
}

export default MyApp;
