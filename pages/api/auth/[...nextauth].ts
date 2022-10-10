import axios from 'axios';
import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from '../../../lib/prisma';

const discordAuthUrl = "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds.members.read";

/**
 * Check the user that's attempting to login against the Pachi Patch Discourse
 * server. Only permit those that are a member of said server and have the
 * "Pachi Patch" role.
 * 
 * @docs https://next-auth.js.org/configuration/callbacks#sign-in-callback
 * 
 * @returns {boolean} Whether or not the user should be signed in
 */
const signInCallback = async ({ account, profile }) => {
  console.info(`Handling signin for user [ ${profile?.username} ]`);

  let userPachiRoles: String[] | undefined;

  try {
    // @docs https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    const { data } = await axios.get(`https://discord.com/api/users/@me/guilds/${process.env.PACHI_SERVER_ID}/member`, {
      headers: {
        Authorization: `Bearer ${account?.access_token}`
      }
    });
    userPachiRoles = data?.roles;
  } catch (error) {
    console.error(`Error fetching Pachi roles for user [ ${profile?.username} ]`, error);
  }

  return userPachiRoles?.some(roleId => roleId === process.env.PACHI_PATCH_AUTHORIZED_ROLE_ID) || '/unauthorized';
};

const options = {
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
    signIn: signInCallback
  }
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
