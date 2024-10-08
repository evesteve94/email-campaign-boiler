import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import CampaignForm from '../components/CampaignForm';

interface Campaign {
  id: string;
  campaignName: string;
  companyName: string;
  companyDescription: string;
  productDescription: string;
  targetAudience: string;
}

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');
        setCampaigns(response.data);
      } catch (error: any) {
        console.error('Error fetching campaigns:', error);
        if (error.response && error.response.status === 401) {
          setError('You need to be logged in to view campaigns.');
          // Redirect to login page after a short delay
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError('An error occurred while fetching campaigns.');
        }
      }
    };

    fetchCampaigns();
  }, [navigate]);

  const handleCampaignAdded = (newCampaign: Campaign) => {
    setCampaigns([...campaigns, newCampaign]);
    setShowForm(false);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary mb-4"
      >
        {showForm ? 'Hide Form' : 'Add New Campaign'}
      </button>

      {showForm && <CampaignForm onCampaignAdded={handleCampaignAdded} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            to={`/campaigns/${campaign.id}`}
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{campaign.campaignName}</h2>
            <p className="text-gray-600">{campaign.companyName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CampaignsPage;