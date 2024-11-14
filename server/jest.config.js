// export default {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     extensionsToTreatAsEsm: ['.ts'],
//     moduleNameMapper: {
//       '^(\\.{1,2}/.*)\\.js$': '$1',
//     },
//     transform: {
//       '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
//     },
//     testMatch: ['<rootDir>/src/**/*.test.ts'],
//   };
  
  module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
      },
    // Optional: if you store tests in a specific folder like `tests`, specify it here
    testMatch: ['**/tests/**/*.test.ts'],
  };