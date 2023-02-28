import { MouseEvent } from 'react';
import Image from 'next/image';
import classnames from 'classnames';

import { RightArrowIcon } from './RightArrowIcon';
import { LeftArrowIcon } from './LeftArrowIcon';
import { LockedIcon } from './LockedIcon';
import { UnlockedIcon } from './UnlockedIcon';

import { User } from '../types/User';

import styles from '../styles/GamerCard.module.css';

interface GamerCardProps {
  classes?: string | string[];
  gamer: User;
  onClick?: (event: any) => void;
  onMove?: () => void;
  onPlayPause?: () => void;
  locked?: boolean;
  playing?: boolean;
  selected?: boolean;
  showActions?: boolean;
}

// Required for Next static export - see https://nextjs.org/docs/api-reference/next/image#loader;
const customLoader = ({ src }: { src: string }) => src;

const GamerCard = ({
  classes = [],
  gamer: { image, name },
  onClick,
  onMove,
  onPlayPause,
  locked = false,
  playing = false,
  selected = false,
  showActions = false,
}: GamerCardProps) => {
  const handleLockUnlockClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onPlayPause && onPlayPause();
  };

  const handleMoveGamerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onMove && onMove();
  };

  return (
    <div
      className={classnames(classes, styles.card, {
        [styles.selected]: selected,
        [styles['with-actions']]: showActions,
      })}
      onClick={onClick}
      tabIndex={0}
    >
      <div className={styles.avatar}>
        <Image
          loader={customLoader}
          width={80}
          height={75}
          alt="Gamer avatar"
          src={image}
          unoptimized
        />
      </div>
      <h3 className={styles.name}>{name}</h3>
      {showActions && (
        <>
          <button
            title={`Move ${playing ? 'out' : 'in'}`}
            className={styles.action}
            onClick={handleMoveGamerClick}
          >
            {playing ? <RightArrowIcon /> : <LeftArrowIcon />}
          </button>
          <button
            title={locked ? 'Unlock' : 'Lock'}
            className={classnames(styles.action, {
              [styles.secondary]: locked,
            })}
            onClick={handleLockUnlockClick}
          >
            {locked ? <LockedIcon /> : <UnlockedIcon />}
          </button>
        </>
      )}
    </div>
  );
};

export default GamerCard;
