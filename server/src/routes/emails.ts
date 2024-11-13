import { Router } from "express";
import prisma from "../db/prisma";
import { Request, Response } from "express";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Resend } from "resend";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

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

async function checkFormerEmails(campaignId: string) {
  try {
    const formerEmails = await prisma.email.findMany({
      where: { campaignId },
      select: { subject: true, content: true },
    });
    const formerEmailData = formerEmails.map(
      (email) => `Title: ${email.subject}, Content: ${email.content}`
    );
    return formerEmailData;
  } catch (error) {
    console.error("Error checking for former emails:", error);
    throw new Error("Failed to retrieve former emails");
  }
}

// Create a new email for a specific campaign
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      id,
      campaignName,
      companyName,
      productDescription,
      companyDescription,
      targetAudience,
    } = EmailRequestSchema.parse(req.body);

    const formerContent = checkFormerEmails(id);

    const prompt = `You are a marketing expert that creates emails for campaigns by carefully considering the campaign name, company name, product description, company description and target audience. You are also a great copywriter and you write emails that are engaging and persuasive. All your emails are captivating, concise and to the point. Here are the details: Campaign name: ${campaignName}, Company name: ${companyName}, Product description: ${productDescription}, Company description: ${companyDescription}, Target audience: ${targetAudience}. Write an email that will be sent to the target audience. Make sure the new email is different from these emails already written: ${formerContent}. The new email need to have an original title and original content, different from the other emails.`;

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
      res
        .status(500)
        .json({ error: "Unable to create email.", message: err.message });
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
    const { subject, content } = req.body;
    const updatedEmail = await prisma.email.update({
      where: { id },
      data: { subject, content },
    });
    res.status(200).json(updatedEmail);
  } catch (err) {
    res.status(400).json({ error: "Unable to update email." });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { recipients: newRecipients } = req.body;

    const currentEmail = await prisma.email.findUnique({
      where: { id },
      select: { recipients: true },
    });

    if (!currentEmail) {
      return res.status(404).json({ error: "Email not found." });
    }

    const updatedRecipients = [...currentEmail.recipients, newRecipients];

    const updatedEmail = await prisma.email.update({
      where: { id },
      data: {
        recipients: updatedRecipients,
      },
    });

    res.status(200).json(updatedEmail);
  } catch (err) {
    console.error("Error updating recipients:", err);
    res.status(400).json({ error: "Unable to update recipients." });
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

router.post("/sendall", async (req: Request, res: Response) => {
  const { recipients, subject, content } = req.body;

  console.log("Start of sendall:", recipients);

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: recipients,
      subject: subject,
      html: `<strong><h1>${subject}</h1></strong>
      </br>
      <p>${content}</p>`,
    });

    console.log(recipients);
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending email", error });
    }

    console.log("Email sent successfully:", data);
    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

export default router;
