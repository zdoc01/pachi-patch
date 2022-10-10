import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import AuthorizedView from '../../components/AuthorizedView';
import Button from '../../components/Button';
import GamerCard from '../../components/GamerCard';
import GamerSelectForm from '../../components/GamerSelectForm';
import Modal from '../../components/Modal';

import GamersContext, { Gamer } from '../../contexts/gamers';
import { PLAYERS_PER_GAME } from '../../constants';

import useSessionRedirect from '../../hooks/use-session-redirect';

import styles from '../../styles/GameNight.module.css';

const rotate = (playing: Gamer[], out: Gamer[]) => {
    const outPaused = out.filter(g => !g.playing);
    const outPlaying = out.filter(g => g.playing);

    const numOut = outPlaying.length;
    const numPlaying = playing.length;

    const nextPlaying = [...outPlaying, ...playing.slice(0, (playing.length - numOut))];
    const nextOut = [ ...outPaused, ...playing.slice((numPlaying - numOut), numPlaying)];

    return [nextPlaying, nextOut];
};

interface EmptySectionMessageProps {
    sectionName: string;
}

const EmptySectionMessage = ({ sectionName }: EmptySectionMessageProps) => (
    <div className={styles.emptySectionMessage}>
        <p>No gamers are {sectionName} at the moment</p>
    </div>
);

const GameNight: NextPage = () => {
    const { gamers, setGamers } = useContext(GamersContext);
    const { data: session } = useSession();

    const [playing, setPlaying] = useState([] as Gamer[]);
    const [out, setOut] = useState([] as Gamer[]);
    const [showAddGamerDialog, setShowAddGamerDialog] = useState(!gamers.some(g => g.selected));

    const handleNextGameClick = () => {
        const [nextPlaying, nextOut] = rotate(playing, out);
        setPlaying(nextPlaying);
        setOut(nextOut);
    };

    const handleAddGamerClick = () => {
        setShowAddGamerDialog(true);
    };

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
        setShowAddGamerDialog(false);
    };

    const handlePlayPauseClick = (gamer: Gamer) => () => {
        setGamers(gamers.reduce((acc: Gamer[], g) => {
            let ret: Gamer[] = [...acc];
            let updated = { ...g };

            if (g.name === gamer.name) {
                updated.playing = !g.playing
                ret[g.playing ? 'push' : 'unshift'](updated);
            } else {
                ret = [...acc, g];
            }

            return ret;
        }, []));
    };

    useEffect(() => {
        const selectedGamers = gamers.filter(g => g.selected);
        const playingGamers = selectedGamers.filter(g => g.playing);
        const pausedGamers = selectedGamers.filter(g => !g.playing);

        setPlaying(playingGamers.slice(0, PLAYERS_PER_GAME));
        setOut([...pausedGamers, ...playingGamers.slice(PLAYERS_PER_GAME, selectedGamers.length)]);
    }, [gamers]);

    useSessionRedirect();

    return (
      <AuthorizedView>
        <div className={styles.gamenight}>
            <section className={styles.actions}>
                <Button color="primary" label="Next Game" onClick={handleNextGameClick} />
                <Button color="secondary" label="Adjust Roster" onClick={handleAddGamerClick} />
            </section>
            <section className={`flex-grid ${styles.status}`}>
                <div className={styles.column}>
                    <h2>In</h2>
                    {playing.length > 0
                        ? playing.map(gamer => (
                            <GamerCard
                                key={gamer.name}
                                gamer={gamer}
                                onPlayPause={handlePlayPauseClick(gamer)}
                            />
                        ))
                        : <EmptySectionMessage sectionName="in"/>
                    }
                </div>
                <div>
                    <h2>Out</h2>
                    {out.length > 0
                        ? out.map(gamer => (
                            <GamerCard
                                key={gamer.name}
                                gamer={gamer}
                                onPlayPause={handlePlayPauseClick(gamer)}
                            />
                        ))
                        : <EmptySectionMessage sectionName="out"/>
                    }
                </div>
            </section>
            {showAddGamerDialog && (
                <Modal onClose={() => setShowAddGamerDialog(false)} title="Add / Remove Gamers">
                    <GamerSelectForm onSubmit={handleGamerSelectSubmit} />
                </Modal>
            )}
        </div>
      </AuthorizedView>
    );
};

export default GameNight;