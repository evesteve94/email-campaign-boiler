import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from "../db/prisma";
import bcrypt from 'bcrypt';

// Define User interface to match Prisma model
interface User {
  id: string;
  email: string;
  password: string;
}

/*-----------------------------------------------------------------------------------------------------------------
serializeUser
This function determines what user data should be stored in the session.
Typically, only a unique identifier (like user.id) is stored to minimize the amount of data saved in the session.
Storing only the id allows you to look up the full user information later when needed.
-----------------------------------------------------------------------------------------------------------------*/

// Serialize the user into the session
passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
  const userTyped = user as User; // Cast user to User type
  done(null, userTyped.id); // Store the user id in the session
});

/*-----------------------------------------------------------------------------------------------------------------
deserializeUser
This function takes the id that was serialized into the session and retrieves the full user object from the database.
It runs on each request that requires user information and populates req.user with the full user object for easy access.
----------------------------------------------------------------------------------------------------------------- */

// Deserialize the user from the session
passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | false | null) => void) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      done(null, user); // Attach user to req.user
    } else {
      done(new Error("User not found"), null);
    }
  } catch (error) {
    done(error, null);
  }
});

// Local strategy for authentication using email and password
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done) => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      // Compare password using bcrypt
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
