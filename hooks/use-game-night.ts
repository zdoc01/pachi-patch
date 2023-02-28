import useSwr, { SWRResponse } from 'swr';
import { GameNight } from '../types/GameNight';

const useGameNight = (id?: string | string[], opts?: Record<string, any>) => {
  const { data, error, isLoading, mutate }: SWRResponse<GameNight, any> =
    // @see https://swr.vercel.app/docs/conditional-fetching
    useSwr(id ? `/api/gamenights/${id}` : null, opts);

  return {
    gameNight: data,
    error,
    isLoading,
    mutateGameNight: mutate,
  };
};

export { useGameNight };
