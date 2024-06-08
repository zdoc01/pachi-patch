import axios from 'axios';
import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { Session, DefaultUser } from 'next-auth/core/types';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import DiscordProvider from 'next-auth/providers/discord';
import { Account, Profile } from 'next-auth/core/types';
import prisma from '../../../lib/prisma';

interface DiscordOAuthProfile extends Profile {
  username: string;
}

interface SignInCallbackArgs {
  account: Account;
  profile: DiscordOAuthProfile;
}

const discordAuthUrl =
  'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds.members.read';

/**
 * Check the user that's attempting to login against the Pachi Patch Discourse
 * server. Only permit those that are a member of said server and have the
 * "Pachi Patch" role.
 *
 * @docs https://next-auth.js.org/configuration/callbacks#sign-in-callback
 *
 * @returns {boolean} Whether or not the user should be signed in
 */
const signInCallback = async ({ account, profile }: SignInCallbackArgs) => {
  console.info(`Handling signin for user [ ${profile?.username} ]`);

  const authorizedRoles =
    process.env.PACHI_PATCH_AUTHORIZED_ROLE_IDS?.split(',');

  let userPachiRoles: string[] | undefined;

  try {
    // @docs https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    const { data } = await axios.get(
      `https://discord.com/api/users/@me/guilds/${process.env.PACHI_SERVER_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${account?.access_token}`,
        },
      }
    );
    userPachiRoles = data?.roles;
  } catch (error) {
    console.error(
      `Error fetching Pachi roles for user [ ${profile?.username} ]`,
      error
    );
  }

  return (
    userPachiRoles?.some((roleId) => authorizedRoles?.includes(roleId)) ||
    '/unauthorized'
  );
};

export const authOptions = {
  providers: [
    DiscordProvider({
      // Override to get user guild info for validation of Pachi Patch role
      authorization: discordAuthUrl,
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_SECRET || '',
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    session: async (session: Session, user: DefaultUser) => {
      console.log('Session callback', session, user);

      if (!session?.user?.id) {
        session.user.id = user?.id;
      }
      return Promise.resolve(session);
    },
    signIn: signInCallback,
  },
};

//@ts-ignore
export default NextAuth(authOptions);
