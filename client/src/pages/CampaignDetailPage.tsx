import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error: any) {
        console.error('Error fetching campaign:', error);
        if (error.response && error.response.status === 404) {
          setError('Campaign not found');
        } else if (error.response && error.response.status === 401) {
          setError('You need to be logged in to view this campaign');
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError('An error occurred while fetching the campaign');
        }
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id, navigate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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