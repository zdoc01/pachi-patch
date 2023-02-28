import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import Button from './Button';

import styles from '../styles/Nav.module.css';

const PACHI_LOGO_URL =
  'https://cdn.discordapp.com/attachments/616064022390767703/1042691440414818334/IMG_0172.PNG';

const links = [
  {
    href: '/',
    label: 'Home',
    requiresAuth: false,
  },
  {
    href: '/gamenight',
    label: 'Game Night',
    requiresAuth: true,
  },
];

const isActivePath = (pathname: string, href: string) => {
  if (pathname === href) {
    return true;
  }

  return href !== '/' && pathname.includes(href);
};

const Account = () => {
  const { data: session, status } = useSession();

  const NoSession = () =>
    status === 'loading' ? (
      <li>Signing in...</li>
    ) : (
      <Link href="/api/auth/signin">Login</Link>
    );

  const HasSession = () => (
    <>
      <li>
        {session?.user?.name} {`(${session?.user?.email})`}
      </li>
      <Button color="primary" label="Logout" onClick={() => signOut()} />
    </>
  );

  return session ? <HasSession /> : <NoSession />;
};

const Nav: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header className={styles.nav}>
      <ul>
        <li className={styles.branding}>
          <Link href="/" passHref>
            <Image
              alt="Pachi Patch"
              src={PACHI_LOGO_URL}
              width="40"
              height="50"
              unoptimized
            />
          </Link>
        </li>
        {links.map(({ href, label, requiresAuth }) => {
          if (requiresAuth && !session) return null;

          return (
            <li
              className={
                isActivePath(router.pathname, href) ? styles.active : ''
              }
              key={href}
            >
              <Link href={href}>{label}</Link>
            </li>
          );
        })}
      </ul>
      <ul className={styles.right}>
        <Account />
      </ul>
    </header>
  );
};

export default Nav;
