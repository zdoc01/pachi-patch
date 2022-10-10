import React from 'react';
import Head from 'next/head'
import Nav from './Nav';
import styles from '../styles/Layout.module.css'

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Real Pachi Patch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav/>
      {children}
    </div>
  )
};

export default Layout;