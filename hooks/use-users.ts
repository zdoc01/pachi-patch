import useSwr, { SWRResponse, RevalidatorOptions } from 'swr';
import { User } from '../types/User';

interface UsersResponse {
  users: User[];
}

interface Options {
  defaultUsers?: User[];
  skipFetch?: boolean;
  [key: string]: any;
}

const useUsers = (opts?: Options) => {
  const defaultOptions = {
    defaultUsers: [],
    skipFetch: false,
    ...(opts || {}),
  };

  const { defaultUsers, skipFetch, ...swrOpts } = defaultOptions;

  const {
    data,
    error,
    isLoading,
    isValidating,
  }: SWRResponse<UsersResponse, any> = useSwr(skipFetch ? null : `/api/users`, {
    refreshInterval: 60000,
    ...swrOpts,
  });

  const users = data?.users || defaultUsers || [];

  const getUserById = (id: string) => users.find((u) => u.id === id);

  if (error) console.error('Unable to retrieve user list', error);

  return {
    error,
    getUserById,
    users,
    isLoading,
    isValidating,
  };
};

export { useUsers };
