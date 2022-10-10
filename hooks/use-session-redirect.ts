import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";

const useSessionRedirect = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.replace('/');
    }
  }, [router, session]);
};

export default useSessionRedirect;