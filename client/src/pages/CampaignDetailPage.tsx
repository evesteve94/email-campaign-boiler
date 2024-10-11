import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Import the configured Axios instance

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

  useEffect(() => {
    const fetchCampaignAndEmails = async () => {
      try {
        const campaignResponse = await api.get(`/campaigns/${id}`);
        setCampaign(campaignResponse.data);

        const emailsResponse = await api.get(`/emails/campaign/${id}`);
        setEmails(emailsResponse.data);
      } catch (error) {
        console.error('Error fetching campaign and emails:', error);
      }
    };

    if (id) {
      fetchCampaignAndEmails();
    }
  }, [id]);

  const handleGenerateEmail = async () => {
    if (!campaign) return;

    setIsGenerating(true);
    try {
      const response = await api.post('/emails', {
        id: campaign.id,
        campaignName: campaign.campaignName,
        companyName: campaign.companyName,
        productDescription: campaign.productDescription,
        companyDescription: campaign.companyDescription,
        targetAudience: campaign.targetAudience,
      });

      setEmails([...emails, response.data]);
    } catch (error) {
      console.error('Error generating email:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{campaign.campaignName}</h1>
      <div className="space-y-4 mb-8">
        <p><strong>Company:</strong> {campaign.companyName}</p>
        <p><strong>Company Description:</strong> {campaign.companyDescription}</p>
        <p><strong>Product Description:</strong> {campaign.productDescription}</p>
        <p><strong>Target Audience:</strong> {campaign.targetAudience}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Campaign Emails</h2>
      <button
        onClick={handleGenerateEmail}
        disabled={isGenerating}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isGenerating ? 'Generating...' : 'Generate New Email'}
      </button>
      {emails.length === 0 ? (
        <p>No emails generated for this campaign yet.</p>
      ) : (
        <div className="space-y-6">
          {emails.map((email) => (
            <div key={email.id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{email.subject}</h3>
              <p className="mb-2"><strong>Recipients:</strong> {email.recipients.join(', ')}</p>
              <p className="whitespace-pre-wrap">{email.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;