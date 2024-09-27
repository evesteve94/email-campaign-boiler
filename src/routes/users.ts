import express from 'express';
import prisma from '../db/prisma';
import { Response, Request } from 'express-serve-static-core';
import { hashPassword } from '../bcrypt';


const router = express.Router();

// Create a new user
router.post("/", async (req: Request, res: Response) => {
    let { email, password, campaigns } = req.body;
    password = hashPassword(password);
    try {
        const user = await prisma.user.create({
            data: { email, password, campaigns },
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ err: "Unable to create user" });
    }
});

// Get all users
router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ err: "Unable to find users" });
    }
});

// Get a user by ID
router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ err: "Unable to find user" });
    }
});

// Update a user (PUT)
router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    let { email, password } = req.body;
    
    // Hash the password if it exists in the request body
    if (password) {
        password = hashPassword(password);
    }

    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: { email, password },
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ err: "Unable to update user" });
    }
});

// **New PATCH Route for Partial Update**
router.patch("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    let { email, password, campaigns } = req.body;
    
    // Prepare an object to hold the fields that will be updated
    const updateData: any = {};
    
    // If email is provided, add it to the updateData object
    if (email) {
        updateData.email = email;
    }

    // If password is provided, hash it and add it to the updateData object
    if (password) {
        updateData.password = hashPassword(password);
    }

    // If campaigns are provided, add them to the updateData object
    if (campaigns) {
        updateData.campaigns = campaigns;
    }

    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: updateData,
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ err: "Unable to patch user" });
    }
});

// Delete a user by ID
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.delete({
            where: { id: id },
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ err: "Unable to delete user" });
    }
});

export default router;
