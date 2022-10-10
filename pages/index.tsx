import classnames from 'classnames';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AuthorizedView from '../components/AuthorizedView';
import Button from '../components/Button';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push('/gamenight/play');
  };

  const handleLoginClick = () => {
    router.push('/api/auth/signin');
  };

  const PlayNowButton = (
    <Button
      color="primary"
      label="Play Now"
      type="button"
      onClick={handlePlayClick}
    />
  );

  const LoginButton = (
    <Button
      color="primary"
      label="Login"
      type="button"
      onClick={handleLoginClick}
    />
  );

  return (
    <section className={styles.section}>
      <h1 className={classnames(
        styles.title,
        'title',
      )}>
        The <i>Real</i> Pachi Patch
      </h1>
      <p className={styles.description}>
        Welcome, Gamer.
      </p>
      <AuthorizedView fallback={LoginButton}>
        {PlayNowButton}
      </AuthorizedView>
    </section>
  );
}

export default Home
