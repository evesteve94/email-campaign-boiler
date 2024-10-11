import React, { useState } from 'react';
import api from '../api';

interface NewCampaign {
  campaignName: string;
  companyName: string;
  companyDescription: string;
  productDescription: string;
  targetAudience: string;
}

interface CampaignFormProps {
  onCampaignAdded: (campaign: any) => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onCampaignAdded }) => {
  const [newCampaign, setNewCampaign] = useState<NewCampaign>({
    campaignName: '',
    companyName: '',
    companyDescription: '',
    productDescription: '',
    targetAudience: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/campaigns', newCampaign);
      onCampaignAdded(response.data);
      setNewCampaign({ campaignName: '', companyName: '', companyDescription: '', productDescription: '', targetAudience: '' });
    } catch (error: any) {
      console.error('Error adding new campaign:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCampaign({ ...newCampaign, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 form-container">
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
        <button type="submit" className="btn btn-primary w-full">
          Add Campaign
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;