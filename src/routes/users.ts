import express from 'express';
import prisma from '../db/prisma';
import { Response, Request } from 'express-serve-static-core';
import { hashPassword } from '../utils/bcrypt';
import { handleValidationErrors} from '../utils/handleValidationErrors'
import {validateCreateUser, validateUpdateUser, validateGetUser, validateDeleteUser} from '../validators/user-validators'


const router = express.Router();

// Create a new user
router.post("/", validateCreateUser, handleValidationErrors, async (req: Request, res: Response) => {
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
router.get("/:id", validateGetUser, handleValidationErrors, async (req: Request, res: Response) => {
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
router.put("/:id", validateUpdateUser, handleValidationErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: any = { ...req.body }; // Spread all fields from request body

    // Hash the password if it exists in the request body
    if (updateData.password) {
        updateData.password = hashPassword(updateData.password);
    }

    try {
        // Update user with provided data
        const user = await prisma.user.update({
            where: { id },
            data: updateData, // Use spread object to update all fields dynamically
        });

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: "Unable to update user" });
    }
});


// Universal PATCH Route for Partial Update
router.patch("/:id", validateUpdateUser, handleValidationErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    
    // If password is provided, hash it
    if (updateData.password) {
        updateData.password = hashPassword(updateData.password);
    }

    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: updateData,
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ err: "Unable to update user" });
    }
});

// Delete a user by ID
router.delete("/:id", validateDeleteUser, handleValidationErrors, async (req: Request, res: Response) => {
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
