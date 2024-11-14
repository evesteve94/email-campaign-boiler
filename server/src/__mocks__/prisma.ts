// src/__mocks__/prismaClient.ts
const prismaMock = {
    campaign: {
      findMany: jest.fn().mockResolvedValue([]), // By default, mock this to return an empty array
    },
  };
  
  export default prismaMock;
  