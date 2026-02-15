import React, { PropsWithChildren } from 'react';
import Head from 'next/head';
import Nav from './Nav';
import styles from '../styles/Layout.module.css';

type Props = PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Real Pachi Patch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      {children}
    </div>
  );
};

export default Layout;
