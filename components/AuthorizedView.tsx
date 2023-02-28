import React from 'react';
import { useSession } from 'next-auth/react';

interface AuthorizedViewProps {
  children?: React.ReactElement<any, any>;
  fallback?: React.ReactElement<any, any>;
  showLoading?: boolean;
}

const AuthorizedView: React.FC<AuthorizedViewProps> = ({
  children = null,
  fallback = null,
  showLoading = false,
}) => {
  const { data: session, status } = useSession();

  return session ? (
    children
  ) : showLoading && status === 'loading' ? (
    <span>Sigining in...</span>
  ) : (
    fallback
  );
};

export default AuthorizedView;
