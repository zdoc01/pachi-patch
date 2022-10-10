import React from 'react';
import { useSession } from 'next-auth/react';


interface AuthorizedViewProps {
  children?: React.ReactElement<any, any>;
  fallback?: React.ReactElement<any, any>;
}

const AuthorizedView: React.FC<AuthorizedViewProps> = ({ children = null, fallback = null}) => {
  const { data: session } = useSession();

  return session ? children : fallback;
};

export default AuthorizedView;