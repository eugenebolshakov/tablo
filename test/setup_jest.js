global.fetch = require('jest-fetch-mock');

// Mock API URL: webpack sets it to the actual URL at build time.
global.API_URL = 'https://example.com';
