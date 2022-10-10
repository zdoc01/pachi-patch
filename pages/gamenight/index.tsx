import { useContext, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import GamersContext, { Gamer } from '../../contexts/gamers';

import AuthorizedView from '../../components/AuthorizedView';
import GamerSelectForm from '../../components/GamerSelectForm';

import useSessionRedirect from '../../hooks/use-session-redirect';

import styles from '../../styles/App.module.css';

const GameNightHome: NextPage = () => {
  const router = useRouter();
  const { gamers, setGamers } = useContext(GamersContext);

  const handleGamerSelectSubmit = (gamersSelected: Gamer[]) => {
    // update existing gamers with latest selections
    setGamers(gamersSelected.map(g => {
        const existingGamerState = gamers.find(({ name }) => name === g.name) || {} as Gamer;
        return {
            ...g,
            // if gamer wasn't previously selected, set them to "playing"
            // otherwise honor their current state
            playing: !existingGamerState.selected ? true : g.playing
        };
    }));
    router.push('/gamenight/play');
  };

  useSessionRedirect();

  return (
    <AuthorizedView>
      <>
        <h1 className={styles.title}>
          {`Who's playing tonight?`}
        </h1>
        <GamerSelectForm onSubmit={handleGamerSelectSubmit} />
      </>
    </AuthorizedView>
  );
}

export default GameNightHome
