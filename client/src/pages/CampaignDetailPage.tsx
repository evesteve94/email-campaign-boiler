import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // Import the configured Axios instance

interface Campaign {
  id: string;
  campaignName: string;
  companyName: string;
  companyDescription: string;
  productDescription: string;
  targetAudience: string;
}

interface Email {
  id: string;
  subject: string;
  content: string;
  recipients: string[];
}

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipients, setRecipients] = useState<string>("");

  useEffect(() => {
    const fetchCampaignAndEmails = async () => {
      try {
        const campaignResponse = await api.get(`/campaigns/${id}`);
        setCampaign(campaignResponse.data);

        const emailsResponse = await api.get(`/emails/campaign/${id}`);
        setEmails(emailsResponse.data);
      } catch (error) {
        console.error("Error fetching campaign and emails:", error);
      }
    };

    if (id) {
      fetchCampaignAndEmails();
    }
  }, [id, recipients]);

  const handleRecipients = async (emailId: string) => {
    try {
      const xyz = await api.patch(`/emails/${emailId}`, {
        recipients: recipients,
      });
      setRecipients("");
    } catch (error) {
      console.error("Error fetching campaign and emails:", error);
    }
  };

  const handleGenerateEmail = async () => {
    if (!campaign) return;

    setIsGenerating(true);
    try {
      const response = await api.post("/emails", {
        id: campaign.id,
        campaignName: campaign.campaignName,
        companyName: campaign.companyName,
        productDescription: campaign.productDescription,
        companyDescription: campaign.companyDescription,
        targetAudience: campaign.targetAudience,
      });

      setEmails([...emails, response.data]);
    } catch (error) {
      console.error("Error generating email:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    try {
      await api.delete(`/emails/${emailId}`);
      // Remove the deleted email from the state
      setEmails(emails.filter((email) => email.id !== emailId));
    } catch (error) {
      console.error("Error deleting email:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSendEmails = async (email: Email) => {
    try {
      console.log(email.recipients);
      await api.post(`/emails/sendall`, {
        recipients: email.recipients,
        subject: email.subject,
        content: email.content,
      });

      console.log("Emails sent successfully.");
    } catch (err) {
      console.error(
        "An unexpected error occurred while trying to send emails:",
        err
      );
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{campaign.campaignName}</h1>
      <div className="space-y-4 mb-8">
        <p>
          <strong>Company:</strong> {campaign.companyName}
        </p>
        <p>
          <strong>Company Description:</strong> {campaign.companyDescription}
        </p>
        <p>
          <strong>Product Description:</strong> {campaign.productDescription}
        </p>
        <p>
          <strong>Target Audience:</strong> {campaign.targetAudience}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Campaign Emails</h2>
      <button
        onClick={handleGenerateEmail}
        disabled={isGenerating}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        {isGenerating ? "Generating..." : "Generate New Email"}
      </button>
      {emails.length === 0 ? (
        <p>No emails generated for this campaign yet.</p>
      ) : (
        <div className="space-y-6">
          {emails.map((email) => (
            <div key={email.id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{email.subject}</h3>
              <input
                placeholder="Recipients"
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
              <button type="submit" onClick={() => handleRecipients(email.id)}>
                Add Recipients
              </button>
              <p className="mb-2">
                <strong>Recipients:</strong> {email.recipients.join(", ")}
              </p>
              <p className="whitespace-pre-wrap mb-4">{email.content}</p>
              {/* Delete button */}
              <button
                className="bg-white text-black rounded mr-2 p-2"
                onClick={() => handleSendEmails(email)}>
                Send to All
              </button>
              <button
                onClick={() => handleDeleteEmail(email.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete Email
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;
