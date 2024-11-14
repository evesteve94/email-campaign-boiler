// tests/campaigns.test.ts
import request from 'supertest';
import app from '../src/index';
import prisma from '../src/db/prisma';


jest.mock('../src/db/prisma', () => ({
    campaign: {
        findMany: jest.fn(),
    },
}))



describe('GET /campaigns', () => {
  it('should return a list of campaigns with correct schema', async () => {
        const mockCampaigns = [
        {
        id: '1',
        campaignName: 'Summer Sale',
        companyName: 'Tech Corp',
        companyDescription: 'Leading tech company',
        productDescription: 'Discounted gadgets for the summer',
        targetAudience: 'Tech enthusiasts',
        emails: [], // Mock empty array for emails
        userId: '123',
        user: {
            id: '123',
            name: 'John Doe', // Add any other required fields in the User model
        },
        },
        // Additional mock campaigns can go here if needed
    ];

    (prisma.campaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

    const response = await request(app).get('/api/campaigns');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(mockCampaigns);
  });

  it('should return a 400 error if there is a database error', async () => {
    (prisma.campaign.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/campaigns');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Unable to retrieve campaigns.');
  });
});
