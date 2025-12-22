import { createClient } from '@vercel/edge-config';

// Initialize Edge Config client
const edgeConfigClient = createClient(process.env.EDGE_CONFIG);

/**
 * Edge Config Database Utility
 * This uses Vercel Edge Config as a simple key-value store
 */

// Get a value from Edge Config
export async function getEdgeConfigValue(key: string) {
  try {
    const value = await edgeConfigClient.get(key);
    return value;
  } catch (error) {
    console.error('Error getting value from Edge Config:', error);
    return null;
  }
}

// Get all data from Edge Config
export async function getAllEdgeConfigData() {
  try {
    const all = await edgeConfigClient.getAll();
    return all;
  } catch (error) {
    console.error('Error getting all data from Edge Config:', error);
    return null;
  }
}

// Check if a key exists
export async function hasEdgeConfigKey(key: string) {
  try {
    const exists = await edgeConfigClient.has(key);
    return exists;
  } catch (error) {
    console.error('Error checking key in Edge Config:', error);
    return false;
  }
}

export default edgeConfigClient;
