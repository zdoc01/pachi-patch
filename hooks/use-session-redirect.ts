import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const useSessionRedirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status !== 'loading') {
      router.replace('/');
    }
  }, [router, session, status]);
};

export default useSessionRedirect;
