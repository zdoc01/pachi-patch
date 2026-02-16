import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { uuid } from 'uuidv4';

import { ArchivedGameNight } from '../../components/ArchivedGameNight';
import AuthorizedView from '../../components/AuthorizedView';
import Button from '../../components/Button';
import GamerCard from '../../components/GamerCard';
import GamerSelectForm from '../../components/GamerSelectForm';
import { Modal } from '../../components/Modal';

import { PLAYERS_PER_GAME } from '../../constants';

import useSessionRedirect from '../../hooks/use-session-redirect';
import { useUsers } from '../../hooks/use-users';
import { useGameNight } from '../../hooks/use-game-night';
import { useGameSessions } from '../../hooks/use-game-sessions';

import { sortByDateAsc } from '../../src/utils/dates';

import { GameSession } from '../../types/GameNight';
import { User } from '../../types/User';

import styles from '../../styles/GameNight.module.css';

const rotate = (playing: GameSession[], out: GameSession[]) => {
  const outLocked = out.filter((g) => g.isLocked);
  const inLocked = playing.filter((g) => g.isLocked);

  const outNotLocked = out.filter((g) => !g.isLocked);
  const inNotLocked = playing.filter((g) => !g.isLocked);

  const numIn = inNotLocked.length;
  const numOut = outNotLocked.length;
  const numToMove = numIn > numOut ? numOut : numIn;

  for (let i = 0; i < numToMove; i++) {
    const nextSessionIn = outNotLocked.shift();
    const nextSessionOut = inNotLocked.pop();

    if (nextSessionIn && nextSessionOut) {
      // move out to in
      inNotLocked.unshift({
        ...nextSessionIn,
        updatedAt: new Date(),
      });
      // move in to out
      outNotLocked.push({
        ...nextSessionOut,
        updatedAt: new Date(),
      });
    }
  }

  const nextIn = [...inLocked, ...inNotLocked];
  const nextOut = [...outLocked, ...outNotLocked];

  return [nextIn, nextOut];
};

const getSortedSessions = (gameSessions?: GameSession[], reverse?: boolean) => {
  if (!gameSessions || gameSessions.length === 0) {
    return [];
  }

  const locked = gameSessions.filter((gs) => gs.isLocked);
  const lockedSorted = locked.sort((a, b) =>
    sortByDateAsc(a.updatedAt, b.updatedAt)
  );

  const notLocked = gameSessions.filter((gs) => !gs.isLocked);
  const notLockedSorted = notLocked.sort((a, b) =>
    sortByDateAsc(a.updatedAt, b.updatedAt)
  );

  if (reverse) {
    lockedSorted.reverse();
    notLockedSorted.reverse();
  }

  return [...lockedSorted, ...notLockedSorted];
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
  const router = useRouter();
  const gameNightId = Array.isArray(router?.query?.id)
    ? router.query.id[0]
    : router?.query?.id;

  const { getUserById, users } = useUsers();
  const {
    gameSessions,
    mutateGameSessionsBatch,
    isMutating,
    isLoading: isLoadingGameSessions,
  } = useGameSessions(gameNightId);
  const { gameNight, error, isLoading, mutateGameNight } = useGameNight(
    gameNightId,
    {
      refreshInterval: isMutating ? 0 : 10000,
    }
  );

  const [playing, setPlaying] = useState([] as GameSession[]);
  const [out, setOut] = useState([] as GameSession[]);
  const [showAddGamerDialog, setShowAddGamerDialog] = useState(false);
  const [showSwapGamersDialog, setShowSwapGamersDialog] = useState(false);
  const [adjustingRoster, setAdjustingRoster] = useState(isMutating);
  const [sessionToSwapOut, setSessionToSwapOut] = useState<GameSession | null>(
    null
  );

  const handleNextGameClick = async () => {
    const [nextIn, nextOut] = rotate(playing, out);

    const nextInToUpdate = nextIn.filter(
      (sessionIn) => !playing.some((p) => p.id === sessionIn.id)
    );
    const nextOutToUpdate = nextOut.filter(
      (sessionIn) => !out.some((o) => o.id === sessionIn.id)
    );

    const sessionsToUpdate = [...nextInToUpdate, ...nextOutToUpdate];

    if (gameNight) {
      mutateGameSessionsBatch({
        gameSessions: sessionsToUpdate.map((gs) => ({
          ...gs,
          isPlaying: !gs.isPlaying,
        })),
      });

      mutateGameNight(
        {
          ...gameNight,
          gameSessions: [
            ...nextIn.map((gs) => ({ ...gs, isPlaying: true })),
            ...nextOut.map((gs) => ({ ...gs, isPlaying: false })),
          ],
        },
        { revalidate: false }
      );
    }
  };

  const handleAddGamerClick = () => {
    setShowAddGamerDialog(true);
  };

  const handleSwapGamersClick = (sessionToSwap: GameSession) => () => {
    setShowSwapGamersDialog(true);
    setAdjustingRoster(true);
    setSessionToSwapOut(sessionToSwap);
  };

  const handleGamerSwapSubmit = (selectedUserIds: User['id'][]) => {
    setShowSwapGamersDialog(false);

    if (gameNight && sessionToSwapOut && selectedUserIds.length) {
      const sessionToMoveIn = gameNight.gameSessions.find(
        (session) => session.userId === selectedUserIds[0]
      );

      if (sessionToMoveIn) {
        const sessionsToUpdate = [
          {
            ...sessionToMoveIn,
            isPlaying: true,
            updatedAt: new Date(),
          },
          {
            ...sessionToSwapOut,
            isPlaying: false,
            updatedAt: new Date(),
          },
        ];

        mutateGameSessionsBatch({
          gameSessions: sessionsToUpdate,
          method: 'PUT',
        });

        mutateGameNight(
          {
            ...gameNight,
            gameSessions: gameNight.gameSessions.map((session) => {
              const updatedSession = sessionsToUpdate.find(
                (gs) => gs.userId === session.userId
              );

              return updatedSession || session;
            }),
          },
          { revalidate: false }
        );
      }
    }
  };

  const handleGamerSelectSubmit = (selectedUserIds: User['id'][]) => {
    setShowAddGamerDialog(false);

    if (gameNight && selectedUserIds.length) {
      setAdjustingRoster(true);

      const sessionsToBeRemoved = gameNight.gameSessions.filter(
        (gs) => !selectedUserIds.some((userId) => gs.userId === userId)
      );
      const sessionsToBeCreated = selectedUserIds
        .filter(
          (userId) => !gameNight.gameSessions.some((gs) => userId === gs.userId)
        )
        .map((newUserId) => ({
          userId: newUserId,
          gameNightId: gameNight.id,
          gameId: 1,
          isLocked: false,
          isPlaying: false,
        }));

      if (sessionsToBeRemoved.length) {
        mutateGameSessionsBatch({
          gameSessions: sessionsToBeRemoved,
          method: 'DELETE',
        });
      }

      if (sessionsToBeCreated.length) {
        mutateGameSessionsBatch({
          gameSessions: sessionsToBeCreated as GameSession[],
          method: 'POST',
        });
      }

      const newSessions = selectedUserIds.map((userId) => {
        const existingSession = gameNight.gameSessions.find(
          (gs) => gs.userId === userId
        );
        return (
          existingSession ||
          ({
            id: `temp-${uuid()}`, // temp ID until created on backend
            userId,
            gameId: 1, // TODO use gameNight.gameId once added to schema
            gameNightId: gameNight.id,
            isPlaying: false,
            isLocked: false,
            updatedAt: new Date(),
            user: getUserById(userId),
          } as GameSession)
        );
      });

      console.log('cache update sessions', newSessions);

      mutateGameNight(
        {
          ...gameNight,
          gameSessions: newSessions,
        },
        { revalidate: false }
      );
    }
  };

  const handlePlayPauseClick = (gameSession: GameSession) => () => {
    fetch(`/api/game-sessions/${gameSession.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...gameSession,
        isLocked: !gameSession.isLocked,
      }),
    });

    if (gameNight) {
      mutateGameNight(
        {
          ...gameNight,
          gameSessions: gameNight.gameSessions.map((gs) => {
            if (gs.id === gameSession.id) {
              return {
                ...gs,
                isLocked: !gameSession.isLocked,
                updatedAt: new Date(),
              };
            }

            return gs;
          }),
        },
        {
          revalidate: false,
        }
      );
    }
  };

  const handleMoveClick = (gameSession: GameSession) => () => {
    fetch(`/api/game-sessions/${gameSession.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...gameSession,
        isPlaying: !gameSession.isPlaying,
      }),
    });

    if (gameNight) {
      mutateGameNight(
        {
          ...gameNight,
          gameSessions: gameNight.gameSessions.map((gs) => {
            if (gs.id === gameSession.id) {
              return {
                ...gs,
                isPlaying: !gs.isPlaying,
                updatedAt: new Date(),
              };
            }

            return gs;
          }),
        },
        {
          revalidate: false,
        }
      );
    }
  };

  useSessionRedirect();

  useEffect(() => {
    const updateSessionState = (sessions: GameSession[]) => {
      const nextPlaying = getSortedSessions(
        sessions.filter((gs) => gs.isPlaying)
      );
      const nextOut = getSortedSessions(
        sessions.filter((gs) => !gs.isPlaying),
        true
      );

      console.log('next playing after sort', nextPlaying);
      console.log('next out after sort', nextOut);

      setPlaying(nextPlaying);
      setOut(nextOut);
    };

    if (gameNight?.gameSessions?.length && !adjustingRoster) {
      const currentlyPlaying = gameNight.gameSessions.filter(
        ({ isPlaying }) => isPlaying
      );
      const currentlyOut = gameNight.gameSessions.filter(
        ({ isPlaying }) => !isPlaying
      );
      const numPlaying = currentlyPlaying.length;

      let updatedGameSessions: GameSession[] = [];

      if (currentlyPlaying.length === 0) {
        console.log('No one playing - handling init');

        // Assuming this is the initial setup of this Game Night so
        // init in/out lists. Not doing this at API layer on create
        // as it shouldn't know constraints (num playing, etc) of a
        // particalur game
        updatedGameSessions = gameNight.gameSessions.map((gs, idx) => {
          return idx < PLAYERS_PER_GAME ? { ...gs, isPlaying: true } : gs;
        });

        mutateGameSessionsBatch({ gameSessions: updatedGameSessions });
      } else if (
        numPlaying < PLAYERS_PER_GAME ||
        numPlaying > PLAYERS_PER_GAME
      ) {
        console.log(
          `Incorrect number of players playing. Found [ ${numPlaying} ], should be [ ${PLAYERS_PER_GAME} ]. Shifting players.`
        );

        // Adjusting the roster may remove players from the GameNight that were
        // previously "in." This logic resets the number of players "in" to the
        // proper number of PLAYERS_PER_GAME by moving players from out --> in.

        const sessionsToPullFrom =
          numPlaying < PLAYERS_PER_GAME ? currentlyOut : currentlyPlaying;

        let numSessionsToBackfill = PLAYERS_PER_GAME - numPlaying;
        numSessionsToBackfill =
          numSessionsToBackfill < 0
            ? numSessionsToBackfill * -1
            : numSessionsToBackfill;

        const sortedSessions = getSortedSessions(sessionsToPullFrom, true);

        const sessionsToMove = sortedSessions
          .filter((gs) => !gs.isLocked)
          .slice(0, numSessionsToBackfill)
          .map((gs) => ({
            ...gs,
            isPlaying: numPlaying < PLAYERS_PER_GAME,
            updatedAt: new Date(),
          }));

        const rest = sortedSessions.filter((gs) =>
          sessionsToMove.some(({ id }) => gs.id !== id)
        );

        console.log('** sorted seshions', sortedSessions);

        console.log('** rest', rest);

        updatedGameSessions = [
          ...(numPlaying < PLAYERS_PER_GAME ? currentlyPlaying : currentlyOut),
          ...sessionsToMove,
          ...rest,
        ];

        console.log('updated game sessions', updatedGameSessions);

        // Important to only update the sessions we're moving here
        // so they end up with a more recent `updatedAt` timestamp
        // for proper sorting (should move from top of Out to top of In)
        if (sessionsToMove.length) {
          mutateGameSessionsBatch({ gameSessions: sessionsToMove });
        }
      }

      if (updatedGameSessions.length) {
        updateSessionState(updatedGameSessions);

        mutateGameNight(
          {
            ...gameNight,
            gameSessions: updatedGameSessions,
          },
          { revalidate: false }
        );
      } else {
        updateSessionState(gameNight.gameSessions);
      }
    }
  }, [gameNight, mutateGameNight, mutateGameSessionsBatch, adjustingRoster]);

  if (error) return <div>An error occurred</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthorizedView>
      {gameNight?.archived ? (
        <ArchivedGameNight />
      ) : (
        <div className={styles.gamenight}>
          <section className={styles.actions}>
            <Button
              color="primary"
              label="Next Game"
              onClick={handleNextGameClick}
              disabled={isMutating}
              loading={isMutating}
            />
            <Button
              color="secondary"
              label="Adjust Roster"
              onClick={handleAddGamerClick}
            />
          </section>
          <section className={`flex-grid ${styles.status}`}>
            <div className={styles.column}>
              <h2>In</h2>
              {playing.length > 0 ? (
                playing.map((session) => {
                  const user = users?.find(({ id }) => id === session.userId);
                  return !user ? null : (
                    <GamerCard
                      classes={[styles.card]}
                      key={user.name}
                      gamer={user}
                      playing={session.isPlaying}
                      locked={session.isLocked}
                      showActions={true}
                      onPlayPause={handlePlayPauseClick(session)}
                      onMove={handleMoveClick(session)}
                      onSwap={handleSwapGamersClick(session)}
                    />
                  );
                })
              ) : (
                <EmptySectionMessage sectionName="in" />
              )}
            </div>
            <div className={styles.column}>
              <h2>Out</h2>
              {out.length > 0 ? (
                out.map((session) => {
                  const user = users?.find(({ id }) => id === session.userId);
                  return !user ? null : (
                    <GamerCard
                      classes={[styles.card]}
                      key={user.name}
                      gamer={user}
                      playing={session.isPlaying}
                      locked={session.isLocked}
                      showActions={true}
                      onPlayPause={handlePlayPauseClick(session)}
                      onMove={handleMoveClick(session)}
                    />
                  );
                })
              ) : (
                <EmptySectionMessage sectionName="out" />
              )}
            </div>
          </section>
          {showAddGamerDialog && (
            <Modal
              onClose={() => setShowAddGamerDialog(false)}
              title="Add / Remove Gamers"
            >
              <GamerSelectForm
                key={gameSessions?.length || 'loading'}
                initialSelectedUserIds={
                  gameSessions?.map(({ userId }) => userId) || []
                }
                gameNightId={gameNight?.id}
                onSubmit={handleGamerSelectSubmit}
                users={users}
              />
            </Modal>
          )}
          {showSwapGamersDialog && sessionToSwapOut ? (
            <Modal
              onClose={() => setShowSwapGamersDialog(false)}
              title={`Who are we swapping for ${sessionToSwapOut.user.name}?`}
            >
              <GamerSelectForm
                key={out?.length || 'loading'}
                selectionType="single"
                users={out.map(({ user }) => user)}
                onSubmit={handleGamerSwapSubmit}
              />
            </Modal>
          ) : null}
        </div>
      )}
    </AuthorizedView>
  );
};

export default GameNight;
