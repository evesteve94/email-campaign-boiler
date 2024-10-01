import express from 'express';
import prisma from '../db/prisma';
import { Response, Request } from 'express-serve-static-core';
import {validateCreateCampaign, validateUpdateCampaign, validateGetCampaign, validateDeleteCampaign} from '../validators/campaign-validators'
import { handleValidationErrors } from '../utils/handleValidationErrors';

const router = express.Router()

// Utility function to extract userId from request
export function getUserId(req: Request): string | null {
  return req.user ? (req.user as { id: string }).id : null;
}

router.get('/dashboard', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to your dashboard!' });
  });

  router.post("/", validateCreateCampaign, handleValidationErrors, async (req: Request, res: Response) => {
    const { campaignName, companyName, companyDescription, productDescription, targetAudience } = req.body;
    const userId = getUserId(req); // Use the utility function

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        const campaign = await prisma.campaign.create({
            data: {
                campaignName,
                companyName,
                companyDescription,
                productDescription,
                targetAudience,
                userId // Associate with the authenticated user
            }
        });
        res.status(201).json(campaign);
    } catch (err) {
        res.status(400).json({ error: "Unable to create campaign." });
    }
});

// READ: Get all campaigns for the authenticated user
router.get("/", validateGetCampaign, handleValidationErrors, async (req: Request, res: Response) => {
    const userId = getUserId(req); // Use the utility function

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        const campaigns = await prisma.campaign.findMany({
            where: { userId } // Only fetch campaigns for this user
        });
        res.status(200).json(campaigns);
    } catch (err) {
        res.status(400).json({ error: "Unable to retrieve campaigns." });
    }
});

// READ: Get a specific campaign by ID
router.get("/:id", validateGetCampaign, handleValidationErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req); // Use the utility function

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id, userId } // Ensure the campaign belongs to the authenticated user
        });

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        res.status(200).json(campaign);
    } catch (err) {
        res.status(400).json({ error: "Unable to retrieve campaign." });
    }
});

// UPDATE: Update a campaign by ID
router.put("/:id", validateUpdateCampaign, handleValidationErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req); // Use the utility function
    const { campaignName, companyName, companyDescription, productDescription, targetAudience } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        const campaign = await prisma.campaign.update({
            where: { id: id }, // Ensure campaign belongs to the user
            data: {
                campaignName,
                companyName,
                companyDescription,
                productDescription,
                targetAudience
            }
        });
        res.status(200).json(campaign);
    } catch (err) {
        res.status(400).json({ error: "Unable to update campaign." });
    }
});

router.patch("/:id", validateUpdateCampaign, handleValidationErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req); // Use the utility function
    const updateData: any = { ...req.body };

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id },
        });

        // Check if the campaign exists and belongs to the authenticated user
        if (!campaign || campaign.userId !== userId) {
            return res.status(404).json({ message: "Campaign not found or you do not have permission to update it." });
        }

        // Update only the fields that are provided in the request body
        const updatedCampaign = await prisma.campaign.update({
            where: { id },
            data: updateData, // Spread the body directly for flexibility
        });

        res.status(200).json(updatedCampaign);
    } catch (err) {
        res.status(400).json({ error: "Unable to update campaign." });
    }
});


// DELETE: Delete a campaign by ID
router.delete("/:id", validateDeleteCampaign, handleValidationErrors, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req); // Use the utility function

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    try {
        const campaign = await prisma.campaign.delete({
            where: { id: id }, // Ensure campaign belongs to the user
        });
        res.status(200).json(campaign);
    } catch (err) {
        res.status(400).json({ error: "Unable to delete campaign." });
    }
});

export default router;