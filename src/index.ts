import express from "express";
import userRouter from './routes/users'
import session from 'express-session'
import passport from "passport";

const app = express();

app.use(express.json());

//TODO: lägg till cookie-options
app.use(
    session({
      secret: 'secretkey',
      resave: false,
      saveUninitialized: false,
    })
  );
  
  // Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

app.use("/api/users", userRouter )

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
