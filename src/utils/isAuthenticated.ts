import { Request, Response, NextFunction } from 'express-serve-static-core';

function isAuthenticated(req: any, res: any, next: NextFunction) {
    console.log(req.user)
    req.user
    ? next()
    : res.status(401).send("Unauthorized - You must be logged in.");
}

export default isAuthenticated