import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Profile } from 'passport-discord';
import { findUser, createUser } from './db';
import { VerifyCallback } from 'passport-oauth2';
import { User } from '../types/types';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  callbackURL: process.env.DISCORD_REDIRECT_URI!,
  scope: ['identify', 'email', 'guilds']
},
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const existingUser: User = await findUser(profile.id);
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = await createUser(profile.id, profile.username, profile.email || "");
        return done(null, newUser);
      }
    } catch (err) {
      console.error('Error in DiscordStrategy:', err);
      return done(err)
    }
  }
));

passport.serializeUser((user, done) => {
  console.log("Serialize user", user)
  done(null, (user as User).id); 
});

passport.deserializeUser((id: string, done) => {
  findUser(id)
    .then((user) => {
      if (user) {
        done(null, user as User);  
      } else {
        done(null, null); 
      }
    })
    .catch((err) => {
      done(err, null);  
    });
});

export default passport;