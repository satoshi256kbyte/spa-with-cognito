const apiConfig = {
  endpoints: {
    guest: process.env.REACT_APP_API_GUEST || process.env.NEXT_PUBLIC_API_GUEST || '/api/guest',
    member: process.env.REACT_APP_API_MEMBER || process.env.NEXT_PUBLIC_API_MEMBER || '/api/member',
  },

  timeout: 5000,
};

export default apiConfig;
