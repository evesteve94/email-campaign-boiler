import express from 'express';
import prisma from '../db/prisma';
import { Response, Request } from 'express-serve-static-core';

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const {email, password, campaigns} = req.body;
    try {
        const user = await prisma.user.create({
            data: {email, password, campaigns }
        })
        res.status(201).json(user)
    } catch(err) {
        res.status(400).json({err: "Unable to create post"})
    }
})

router.get("/", async (req: Request, res: Response) => {
    try{
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    } catch(err) {
        res.status(400).json({err: "Unable to find users"})
    }
})

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const user = await prisma.user.findUnique({
            where : {
                id : id
            }
        })
        res.status(200).json(user)
    } catch(err) {
        res.status(400).json({err: "Unable to find users"})
    }
})

router.put("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    const {email, password} = req.body;
    try{
        const user = await prisma.user.update({
            where : {
                id : id
            },
            data : {
                email : email,
                password : password
            }

        })
        res.status(200).json(user)
    } catch(err) {
        res.status(400).json({err: "Unable to find users"})
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const user = await prisma.user.delete({
            where : {
                id : id
            }
        })
        res.status(200).json(user)
    } catch(err) {
        res.status(400).json({err: "Unable to find users"})
    }
})

export default router;