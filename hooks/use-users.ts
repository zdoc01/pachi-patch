import useSwr, { SWRResponse, RevalidatorOptions } from 'swr';
import { User } from '../types/User';

interface UsersResponse {
  users: User[];
}

const useUsers = (opts?: Record<string, any>) => {
  const {
    data,
    error,
    isLoading,
    isValidating,
  }: SWRResponse<UsersResponse, any> = useSwr(`/api/users`, {
    refreshInterval: 60000,
    ...opts,
  });
  const users = data?.users || [];

  if (error) console.error('Unable to retrieve user list', error);

  return {
    error,
    users,
    isLoading,
    isValidating,
  };
};

export { useUsers };
