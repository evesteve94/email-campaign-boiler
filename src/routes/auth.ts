import express from "express";
import passport from "passport";
import "../strategies/local-strategy";

const router = express.Router();

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, this callback is called
  res.status(200).json({ message: "Login successful", user: req.user });
});

//loggar ut och gör vår cookie invalid
router.post("/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logOut((err) => {
    if (err) return res.sendStatus(400);
    res.status(200).send("Logged out");
  });
});

// Optional: Endpoint to check authentication status
router.get("/status", (req, res) => {
  return req.user
    ? res.status(200).send(req.user)
    : res.status(401).send("Unauthorized");
});



export default router;
