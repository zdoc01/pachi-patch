import { useContext, FormEvent } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import GamersContext, { Gamer } from '../contexts/gamers';
import GamerSelectForm from '../components/GamerSelectForm';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();
  const { setGamers } = useContext(GamersContext);

  const handleGamerSelectSubmit = (gamers: Gamer[]) => {
    setGamers(gamers);
    router.push('/gamenight');
  };

  return (
    <>
        <h1 className={styles.title}>
          {`Who's playing tonight?`}
        </h1>
        <GamerSelectForm onSubmit={handleGamerSelectSubmit} />
    </>
  )
}

export default Home
