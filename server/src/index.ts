import express from "express";
import session from 'express-session'
import passport from "passport";
import cookieParser from "cookie-parser"
import isAuthenticated from './utils/isAuthenticated';
import cors from 'cors';
import emailRoutes from './routes/emails';

//routes
import authRouter from "./routes/auth"
import userRouter from './routes/users'
import campaignsRouter from './routes/campaigns'

const app = express();

// Update the CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your client's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(cookieParser('malmo')); // Pass secret here
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-more-secure-secret-key', // Use an environment variable for the secret
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true // Prevent client-side access to the cookie
  }
}));
  
  // Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

app.use("/api/users", userRouter )
app.use("/api/auth", authRouter)
// skyddad route - måste vara inloggad (isAuthenticated) för att se
app.use("/api/campaigns", isAuthenticated, campaignsRouter)
app.use('/api/emails', emailRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
