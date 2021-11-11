import { MouseEvent } from 'react';
import Image from 'next/image';

import { Gamer } from '../contexts/gamers';

import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import styles from '../styles/GamerCard.module.css'

interface GamerCardProps {
    classes?: string | string[];
    gamer: Gamer;
    onClick?: (event: any) => void;
    onPlayPause?: () => void;
}

// Required for Next static export - see https://nextjs.org/docs/api-reference/next/image#loader;
const customLoader = ({ src }: { src: string }) => src;

const GamerCard = ({ classes = [], gamer: { avatarUrl, name, playing, selected }, onClick, onPlayPause }: GamerCardProps) => {
    const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onPlayPause && onPlayPause();
    };

    return (
        <div className={`${Array.isArray(classes) ? classes.join(' ') : classes} ${styles.card} ${selected ? styles.selected : ''}`} onClick={onClick}>
            <Image className={styles.avatar} loader={customLoader} width={80} height={75} alt="Gamer avatar" src={avatarUrl} />
            <h3 className={styles.name}>{name}</h3>
            <button className={styles.actions} onClick={handleActionClick}>
                {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
        </div>
    );
};

export default GamerCard;