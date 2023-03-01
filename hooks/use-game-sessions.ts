import useSwr, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { GameNight, GameSession } from '../types/GameNight';

interface GameSessionsResponse {
  gameSessions: GameSession[];
}

const updateGameSessions = async (
  url: string,
  {
    arg: { gameSessions, method = 'PUT' },
  }: { arg: { gameSessions: GameSession[]; method?: string } }
) => {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameSessions }),
  }).then((res) => res.json());
};

const useGameSessions = (
  gameNightId?: GameNight['id'],
  opts?: Record<string, any>
) => {
  const {
    data,
    error,
    isLoading,
    isValidating,
  }: SWRResponse<GameSessionsResponse, any> = useSwr(
    // @see https://swr.vercel.app/docs/conditional-fetching
    gameNightId ? `/api/game-sessions?gameNightId=${gameNightId}` : null,
    opts
  );

  const { trigger, isMutating } = useSWRMutation(
    '/api/game-sessions/batch',
    updateGameSessions
  );

  return {
    gameSessions: data?.gameSessions,
    error,
    isLoading,
    isMutating,
    isValidating,
    mutateGameSessionsBatch: trigger,
  };
};

export { useGameSessions };
