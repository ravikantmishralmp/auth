module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest', // Use babel-jest for JS files
    },
    setupFiles: ['./jest.setup.js'], // Specify setup file
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS
    },
    transformIgnorePatterns: ['/node_modules/(?!(@mui|react-router-dom)/)'], // Transform specific ESM modules
  };
  