import React, { useEffect, useState } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma from '../../lib/prisma';

import { GameNight } from '../../types/GameNight';
import { User } from '../../types/User';

import AuthorizedView from '../../components/AuthorizedView';
import Button from '../../components/Button';
import GamerSelectForm from '../../components/GamerSelectForm';
import { Modal } from '../../components/Modal';

import { IconCog } from '../../src/icons/IconCog';

import useSessionRedirect from '../../hooks/use-session-redirect';
import { getFormattedDate, timeSince } from '../../src/utils/dates';

import styles from '../../styles/GameNightHome.module.css';

const OVERWATCH_BILLBOARD_IMG_SRC =
  'https://images.blz-contentstack.com/v3/assets/blt2477dcaf4ebd440c/bltdad361c29b29b03a/5cef227acf7aa6330ac66561/eichenwalde-screenshot-003.jpg?auto=webp';
const OVERWATCH_2_MASTHEAD_IMG_SRC =
  'https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltbcf2689c29fa39eb/622906a991f4232f0085d3cc/Masthead_Overwatch2_Logo.png?format=webply&quality=90';

interface GameNightHomePageProps {
  gameNights: GameNight[];
}

const normalizeHistoricalGameNights = (gameNights: GameNight[]) => {
  const toUpdate: Promise<any>[] = [];

  gameNights.forEach((gn) => {
    if (!gn.archived) {
      const updatePromise = fetch(`/api/gamenights/${gn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archived: true,
        }),
      });

      toUpdate.push(updatePromise);
    }
  });

  if (toUpdate.length) {
    Promise.all(toUpdate);
  }
};

const InProgress = ({ gameNight }: { gameNight: GameNight }) => {
  return (
    <article className={styles.inprogress} tabIndex={0}>
      <section className={styles.billboard}>
        <Image
          alt="Game Night Billboard"
          src={OVERWATCH_BILLBOARD_IMG_SRC}
          layout="fill"
          sizes="100vw"
          unoptimized
        />
        <div className={styles.masthead}>
          <Image
            alt="Overwatch 2"
            src={OVERWATCH_2_MASTHEAD_IMG_SRC}
            width="480"
            height="50"
            unoptimized
          />
        </div>
      </section>
      <section className={styles.content}>
        <h4 className={styles.title}>{`Game Night #${gameNight.id}`}</h4>
        <p>{`Started ${timeSince(gameNight.createdAt)} ago`}</p>
        <p>{`Created by ${gameNight.createdBy.name}`}</p>
      </section>
      <Link href={`/gamenight/${gameNight.id}`} passHref>
        <a className={styles.link} tabIndex={-1} aria-hidden="true"></a>
      </Link>
    </article>
  );
};

const StartNewSession = ({
  isCreatingSession,
  onStartNewClick,
}: {
  isCreatingSession: boolean;
  onStartNewClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <div className={styles.start}>
    {isCreatingSession ? (
      <>
        <IconCog classes={['spin']} />
        <p>Creating new game night session...</p>
      </>
    ) : (
      <>
        <p>{`Doesn't look like there's a Game Night in progress, so go on, fire one up!`}</p>
        <Button
          color="primary"
          label="Start New Session"
          onClick={onStartNewClick}
        />
      </>
    )}
  </div>
);

const History = ({ gameNights }: { gameNights: GameNight[] }) => {
  return (
    <ul className={styles.history}>
      {gameNights.map((gn) => (
        <li key={gn.id}>
          <Link href={`/gamenight/${gn.id}`}>
            {`Game Night #${gn.id} (${getFormattedDate(gn.createdAt)})`}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const GameNightHome: NextPage<GameNightHomePageProps> = ({
  gameNights = [],
}) => {
  const [creatingGameNight, setCreatingGameNight] = useState(false);
  const [isSelectingUsers, setIsSelectingUsers] = useState(false);
  const [gameNightsInProgress, setGameNightsInProgress] = useState(
    [] as GameNight[]
  );
  const [pastGameNights, setPastGameNights] = useState([] as GameNight[]);

  const router = useRouter();

  const handleGamerSelectSubmit = async (selectedUserIds: User['id'][]) => {
    setIsSelectingUsers(false);

    if (selectedUserIds.length) {
      setCreatingGameNight(true);

      const newGameNight = await fetch('/api/gamenights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: selectedUserIds,
        }),
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error('Unable to create a new game night instance', error);
          alert(
            'Oops. An error occurred. Try again, or let Zach know if the issue persists.'
          );
        })
        .finally(() => {
          setCreatingGameNight(false);
        });

      if (newGameNight?.id) {
        router.push(`/gamenight/${newGameNight.id}`);
      }
    }
  };

  useSessionRedirect();

  useEffect(() => {
    const oneDayAgo = +new Date() - 24 * 60 * 60 * 1000;
    // Anything started within the last day is considered "In Progress"
    const inProgress = gameNights.filter(
      (gn) => gn.createdAt.getTime() > oneDayAgo || !gn.archived
    );
    const historical = gameNights.filter(
      (gn) => !inProgress.some(({ id }) => id === gn.id)
    );

    normalizeHistoricalGameNights(historical);

    setGameNightsInProgress(inProgress);
    setPastGameNights(historical);
  }, [gameNights]);

  return (
    <AuthorizedView>
      <div className={styles.container}>
        <section>
          <h1>In Progress</h1>
          {gameNightsInProgress.length ? (
            <InProgress gameNight={gameNightsInProgress[0]} />
          ) : (
            <StartNewSession
              isCreatingSession={creatingGameNight}
              onStartNewClick={() => setIsSelectingUsers(true)}
            />
          )}
        </section>
        <section>
          <h1>Past Sessions</h1>
          {pastGameNights.length ? (
            <History gameNights={pastGameNights} />
          ) : (
            <p>Still waiting for you to finish a session...</p>
          )}
        </section>
        {isSelectingUsers && (
          <Modal
            onClose={() => setIsSelectingUsers(false)}
            title="Who's playing tonight?"
          >
            <GamerSelectForm onSubmit={handleGamerSelectSubmit} />
          </Modal>
        )}
      </div>
    </AuthorizedView>
  );
};

export default GameNightHome;

export const getStaticProps: GetStaticProps = async () => {
  const gameNights = await prisma.gameNight.findMany({
    include: {
      createdBy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return {
    props: { gameNights },
  };
};
