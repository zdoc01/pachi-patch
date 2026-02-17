import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import Button from './Button';

import { PACHI_LOGO_URL } from '../constants';

import styles from '../styles/Nav.module.css';
import { DefaultUser } from 'next-auth';

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

const NoSession = ({ status }: { status: string }) =>
  status === 'loading' ? (
    <li>Signing in...</li>
  ) : (
    <li>
      <Link href="/api/auth/signin">Login</Link>
    </li>
  );

const HasSession = ({ user }: { user: DefaultUser }) => (
  <>
    <li className={styles.username}>
      {user?.name} {`(${user?.email})`}
    </li>
    <Button color="primary" label="Logout" onClick={() => signOut()} />
  </>
);

const Account = () => {
  const { data: session, status } = useSession();
  return session ? (
    <HasSession user={session.user} />
  ) : (
    <NoSession status={status} />
  );
};

const Nav: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

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
              priority
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
