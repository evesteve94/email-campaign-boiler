import passport from "passport";
import { Strategy } from 'passport-local'
import prisma from "../db/prisma";
import bcrypt from 'bcrypt'

passport.use(
    new Strategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
  
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );