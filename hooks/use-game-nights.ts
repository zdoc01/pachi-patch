import useSwr from 'swr';
import useSWRMutation from 'swr/mutation';
import { User } from '@prisma/client';
import { GameNight } from '../types/GameNight';

interface GameNightsResponse {
  gameNights: GameNight[];
}

const GAME_NIGHTS_ENDPOINT = '/api/gamenights';

const createGameNight = async (
  url: string,
  { arg }: { arg: { users: User['id'][] } }
) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  }).then((res) => res.json());
};

const useGameNights = (opts?: Record<string, any>) => {
  const { data, error, isLoading } =
    // @see https://swr.vercel.app/docs/conditional-fetching
    useSwr<GameNightsResponse>(GAME_NIGHTS_ENDPOINT, opts);

  const { trigger, isMutating } = useSWRMutation(
    GAME_NIGHTS_ENDPOINT,
    createGameNight,
    {
      populateCache: (
        newGameNight: GameNight,
        existingGameNights: GameNightsResponse | undefined
      ) => {
        const filteredGameNights =
          existingGameNights?.gameNights?.filter(
            (gn) => gn.id !== newGameNight.id
          ) || [];
        return {
          gameNights: [...filteredGameNights, newGameNight],
        };
      },
      revalidate: false,
    }
  );

  return {
    gameNights: data?.gameNights,
    error,
    isLoading,
    isMutating,
    createGameNight: trigger,
  };
};

export { useGameNights };
