import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import styles from '../styles/Nav.module.css';

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
  }
];

const isActivePath = (pathname: string, href: string) => {
  if (pathname === href) {
    return true;
  }

  return href !== '/' && pathname.includes(href);
};

const Nav: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header className={styles.nav}>
        <ul>
          {links.map(({ href, label, requiresAuth }) => {
            if (requiresAuth && !session) return null;
            
            return (
              <li
                className={isActivePath(router.pathname, href) ? styles.active : ''}
                key={href}
              >
                <Link href={href}>{label}</Link>
              </li>
            )
          })}
        </ul>
        <ul>
          {
            session && (
              <li>{session.user?.name} {`(${session.user?.email})`}</li>
            )
          }
          <li>
            {
              session ? (
                <button onClick={() => signOut()}>Logout</button>
              ) : (
                <Link href="/api/auth/signin">Login</Link>
              )
            }
          </li>
        </ul>
    </header>
  )
};

export default Nav;