import { useContext, useEffect, useState, FormEvent } from 'react';

import Button from './Button';
import GamerCard from './GamerCard';
import GamersContext, { Gamer } from '../contexts/gamers';

import { PLAYERS_PER_GAME } from '../constants';

import styles from '../styles/GamerSelectForm.module.css'

interface GamerSelectFormProps {
    onSubmit: (selectedGamers: Gamer[]) => void;
}

const GamerSelectForm = ({ onSubmit }: GamerSelectFormProps) => {
    const { gamers } = useContext(GamersContext);
    const [gamersInForm, setGamersInForm] = useState(gamers.map(g => ({ ...g })));

    const handleGamerClick = (gamer: Gamer) => (event: MouseEvent) => {
        event.preventDefault();

        // updated selected state for clicked gamer
        let gamersUpdated = gamersInForm.reduce((acc: Gamer[], g) => {
            let updatedGamer = { ...g };
            let ret: Gamer[] = [ ...acc ];

            if (updatedGamer.name === gamer.name) {
                updatedGamer = { ...updatedGamer, selected: !gamer.selected };
                // move gamer to top of list if they weren't previously
                // selected so they're in next round
                ret[gamer.selected ? 'push' : 'unshift'](updatedGamer);
            } else {
                ret = [ ...ret, g ];
            }

            return ret;
        }, []);

        setGamersInForm(gamersUpdated);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(gamersInForm);
    };

    return (
        <form className={styles['gamer-select-form']} onSubmit={handleSubmit}>
          <div className="flex-grid">
            {gamers.map(gamer => {
                const currentSelectedState = (gamersInForm.find(g => (g.name === gamer.name)) || {}).selected || false;
                return (
                    <GamerCard
                        classes={styles['gamer-card']}
                        key={gamer.name}
                        gamer={{
                            ...gamer,
                            selected: currentSelectedState 
                        }}
                        onClick={handleGamerClick({ ...gamer, selected: currentSelectedState })}
                    />
                );
            })}
          </div>

          <Button classes={[styles['start-btn']]} color="primary" label="Leggo" type="submit" />
        </form>
    )
};

export default GamerSelectForm;