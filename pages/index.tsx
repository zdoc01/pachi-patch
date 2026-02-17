import classnames from 'classnames';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import AuthorizedView from '../components/AuthorizedView';
import Button from '../components/Button';

import { PACHI_LOGO_URL } from '../constants';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const isLoadingSession = status === 'loading';

  const handlePlayClick = () => {
    router.push('/gamenight');
  };

  const handleLoginClick = () => {
    router.push('/api/auth/signin');
  };

  const PlayNowButton = (
    <Button
      color="primary"
      disabled={isLoadingSession}
      label="Play Now"
      loading={isLoadingSession}
      type="button"
      onClick={handlePlayClick}
    />
  );

  const LoginButton = (
    <Button
      color="primary"
      disabled={isLoadingSession}
      label="Login"
      loading={isLoadingSession}
      type="button"
      onClick={handleLoginClick}
    />
  );

  return (
    <div className={styles.container}>
      <section className={classnames(styles.section, styles.logo)}>
        <Image
          alt="Pachi Patch"
          src={PACHI_LOGO_URL}
          width="350"
          height="450"
          priority
          unoptimized
        />
      </section>
      <section className={styles.section}>
        <h1 className={classnames(styles.title, 'title')}>
          The <i>Real</i> Pachi Patch
        </h1>
        <p className={styles.description}>Welcome, Gamer.</p>
        <AuthorizedView fallback={LoginButton}>{PlayNowButton}</AuthorizedView>
      </section>
    </div>
  );
};

export default Home;
