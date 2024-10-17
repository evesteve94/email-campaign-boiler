import express from "express";
import prisma from "../db/prisma";
import { Response, Request } from "express-serve-static-core";
import isAuthenticated from "../utils/isAuthenticated"; // Make sure this import is correct

const router = express.Router();

// Apply isAuthenticated middleware to all routes in this router
router.use(isAuthenticated);

// Utility function to extract userId from request
export function getUserId(req: Request): string | null {
  return req.user ? (req.user as { id: string }).id : null;
}

router.get("/dashboard", (req: Request, res: Response) => {
  res.json({ message: "Welcome to your dashboard!" });
});

router.post("/", async (req: Request, res: Response) => {
  const {
    campaignName,
    companyName,
    companyDescription,
    productDescription,
    targetAudience,
  } = req.body;
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
        userId, // Associate with the authenticated user
      },
    });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: "Unable to create campaign." });
  }
});

// READ: Get all campaigns for the authenticated user
// READ: Get all campaigns for the authenticated user
router.get("/", async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error fetching all campaigns:", err);
    res.status(400).json({ error: "Unable to retrieve campaigns." });
  }
});

// READ: Get a specific campaign by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.status(200).json(campaign);
  } catch (err) {
    console.error("Error retrieving campaign:", err);
    res.status(500).json({ error: "Unable to retrieve campaign." });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getUserId(req); // Use the utility function
  const updateData: any = { ...req.body }; // Spread all fields from request body

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    // Ensure campaign exists and belongs to the authenticated user
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign || campaign.userId !== userId) {
      return res
        .status(404)
        .json({
          message:
            "Campaign not found or you do not have permission to update it.",
        });
    }

    // Update campaign with provided data
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: updateData, // Use spread object to update all fields dynamically
    });

    res.status(200).json(updatedCampaign);
  } catch (err) {
    res.status(400).json({ error: "Unable to update campaign." });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
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
      return res
        .status(404)
        .json({
          message:
            "Campaign not found or you do not have permission to update it.",
        });
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
router.delete("/:id", async (req: Request, res: Response) => {
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
