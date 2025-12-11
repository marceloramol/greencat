import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68e84a50dd41f4fd278cf06a", 
  requiresAuth: true // Ensure authentication is required for all operations
});
