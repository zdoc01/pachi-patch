import { MouseEvent } from 'react';
import Image from 'next/image';
import classnames from 'classnames';

import { LeftArrowIcon } from './LeftArrowIcon';
import { LockedIcon } from './LockedIcon';
import { RightArrowIcon } from './RightArrowIcon';
import { SwapIcon } from './SwapIcon';
import { UnlockedIcon } from './UnlockedIcon';

import { User } from '../types/User';

import styles from '../styles/GamerCard.module.css';

interface GamerCardProps {
  classes?: string | string[];
  gamer: User;
  onClick?: (event: any) => void;
  onMove?: () => void;
  onPlayPause?: () => void;
  onSwap?: () => void;
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
  onSwap,
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

  const handleSwapGamerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSwap && onSwap();
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
        <div className={styles.actions}>
          <button
            title={`Move ${playing ? 'out' : 'in'}`}
            className={styles.action}
            onClick={handleMoveGamerClick}
          >
            {playing ? <RightArrowIcon /> : <LeftArrowIcon />}
          </button>
          {onSwap && (
            <button
              title={`Swap with gamer ${playing ? 'out' : 'in'}`}
              className={styles.action}
              onClick={handleSwapGamerClick}
            >
              <SwapIcon />
            </button>
          )}
          <button
            title={locked ? 'Unlock' : 'Lock'}
            className={classnames(styles.action, {
              [styles.secondary]: locked,
            })}
            onClick={handleLockUnlockClick}
          >
            {locked ? <LockedIcon /> : <UnlockedIcon />}
          </button>
        </div>
      )}
    </div>
  );
};

export default GamerCard;
