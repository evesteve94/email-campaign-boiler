import { Router } from "express";
import prisma from "../db/prisma";
import { Request, Response } from "express";
import { z } from 'zod';
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

const router = Router();

const EmailRequestSchema = z.object({
    id: z.string(), // Changed from campaignId to id
    campaignName: z.string(),
    companyName: z.string(),
    productDescription: z.string(),
    companyDescription: z.string(),
    targetAudience: z.string(),
});

const EmailResponseSchema = z.object({
    subject: z.string(),
    content: z.string(),
    recipients: z.array(z.string()),
});

type EmailRequest = z.infer<typeof EmailRequestSchema>;
type EmailResponse = z.infer<typeof EmailResponseSchema>;

// Function to save email to the database
async function saveEmailToDatabase(email: EmailResponse, campaignId: string) {
    try {
        const savedEmail = await prisma.email.create({
            data: {
                ...email,
                campaignId, // This should still be campaignId as per the Prisma schema
            },
        });
        return savedEmail;
    } catch (error) {
        console.error("Error saving email to database:", error);
        throw new Error("Failed to save email to database");
    }
}

// Create a new email for a specific campaign
router.post("/", async (req: Request, res: Response) => {
    try {
        const { id, campaignName, companyName, productDescription, companyDescription, targetAudience } = EmailRequestSchema.parse(req.body);

        const prompt = `You are a marketing expert that creates emails for campaigns by carefully considering the campaign name, company name, product description, company description and target audience. You are also a great copywriter and you write emails that are engaging and persuasive. All your emails are captivating, concise and to the point. Here are the details: Campaign name: ${campaignName}, Company name: ${companyName}, Product description: ${productDescription}, Company description: ${companyDescription}, Target audience: ${targetAudience}. Write an email that will be sent to the target audience.`;

        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: EmailResponseSchema,
            prompt: prompt,
        });

        // Save the generated email to the database
        const savedEmail = await saveEmailToDatabase(object, id);

        res.status(201).json(savedEmail);
    } catch (err) {
        console.error("Error creating email:", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid input", details: err.errors });
        } else if (err instanceof Error) {
            res.status(500).json({ error: "Unable to create email.", message: err.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get all emails for a specific campaign
router.get("/campaign/:campaignId", async (req: Request, res: Response) => {
    try {
        const { campaignId } = req.params;
        const emails = await prisma.email.findMany({
            where: { campaignId },
        });
        res.status(200).json(emails);
    } catch (err) {
        res.status(400).json({ error: "Unable to retrieve emails." });
    }
});


// Update an email
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { subject, content, recipients } = req.body;
        const updatedEmail = await prisma.email.update({
            where: { id },
            data: { subject, content, recipients },
        });
        res.status(200).json(updatedEmail);
    } catch (err) {
        res.status(400).json({ error: "Unable to update email." });
    }
});

// Delete an email
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.email.delete({ where: { id } });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: "Unable to delete email." });
    }
});

export default router;
