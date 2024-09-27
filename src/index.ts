import express from "express";
import userRouter from './routes/users'
import session from 'express-session'
import passport from "passport";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth"

const app = express();

app.use(express.json());

//TODO: lägg till cookie-options
app.use(cookieParser('malmo')); // Pass secret here
app.use(express.json());
app.use(session({
  secret: 'malmo', //borde vara mer komplext,
  saveUninitialized: false, //sparar inte sessions som inte har aktivitet
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  }
}));
  
  // Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

app.use("/api/users", userRouter )
app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
