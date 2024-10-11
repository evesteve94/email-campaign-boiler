import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Import the configured Axios instance

interface Campaign {
  id: string;
  campaignName: string;
  companyName: string;
  companyDescription: string;
  productDescription: string;
  targetAudience: string;
}

interface NewCampaign {
  campaignName: string;
  companyName: string;
  companyDescription: string;
  productDescription: string;
  targetAudience: string;
}

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // New state for the form
  const [newCampaign, setNewCampaign] = useState<NewCampaign>({
    campaignName: '',
    companyName: '',
    companyDescription: '',
    productDescription: '',
    targetAudience: '',
  });

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

  // New function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/campaigns', newCampaign);
      setCampaigns([...campaigns, response.data]);
      setNewCampaign({ campaignName: '', companyName: '', companyDescription: '', productDescription: '', targetAudience: '' }); // Reset form
    } catch (error: any) {
      console.error('Error adding new campaign:', error);
      setError('An error occurred while adding the new campaign.');
    }
  };

  // New function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCampaign({ ...newCampaign, [name]: value });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
      
      {/* New campaign form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Campaign</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="campaignName"
            value={newCampaign.campaignName}
            onChange={handleInputChange}
            placeholder="Campaign Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="companyName"
            value={newCampaign.companyName}
            onChange={handleInputChange}
            placeholder="Company Name"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="companyDescription"
            value={newCampaign.companyDescription}
            onChange={handleInputChange}
            placeholder="Company Description"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="productDescription"
            value={newCampaign.productDescription}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="targetAudience"
            value={newCampaign.targetAudience}
            onChange={handleInputChange}
            placeholder="Target Audience"
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Campaign
          </button>
        </div>
      </form>

      {/* Existing campaigns list */}
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