// API configuration
const apiConfig = {
  // Base API URL from environment variables
  baseUrl:
    process.env.REACT_APP_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://api.example.com',

  // Endpoints
  endpoints: {
    guest: '/guest',
    member: '/member',
  },

  // Timeout in milliseconds
  timeout: 5000,
};

export default apiConfig;
