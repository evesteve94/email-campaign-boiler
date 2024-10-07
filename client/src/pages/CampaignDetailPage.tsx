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

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{campaign.campaignName}</h1>
      <div className="space-y-4">
        <p><strong>Company:</strong> {campaign.companyName}</p>
        <p><strong>Company Description:</strong> {campaign.companyDescription}</p>
        <p><strong>Product Description:</strong> {campaign.productDescription}</p>
        <p><strong>Target Audience:</strong> {campaign.targetAudience}</p>
      </div>
    </div>
  );
};

export default CampaignDetailPage;