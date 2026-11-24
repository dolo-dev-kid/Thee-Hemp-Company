// Inventory cache + refresh cron for the Pittsburgh Dispensary POS API.
// server.js expects: startInventoryCron() and getCachedInventory().
// The cache is in-memory and refreshes from BioTrack (falls back to mock
// inventory when no BioTrack credentials are configured).
const cron = require('node-cron');
const biotrackService = require('./biotrackService');

let cachedInventory = null;
let lastRefresh = null;
let refreshInFlight = null;

async function refreshInventory() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const products = await biotrackService.getLiveInventory();
      cachedInventory = Array.isArray(products) ? products : [];
      lastRefresh = new Date();
      console.log(`[INVENTORY CRON] Refreshed ${cachedInventory.length} products at ${lastRefresh.toISOString()}`);
    } catch (err) {
      console.error('[INVENTORY CRON ERROR]', err.message);
      // Keep the last good cache; seed mock data if we have never had any.
      if (!cachedInventory) {
        cachedInventory = biotrackService.getMockInventory();
        lastRefresh = new Date();
      }
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

function startInventoryCron() {
  // Seed the cache immediately, then refresh every 15 minutes.
  refreshInventory();
  cron.schedule('*/15 * * * *', refreshInventory);
  console.log('[INVENTORY CRON] Started — refresh every 15 minutes.');
}

async function getCachedInventory() {
  if (!cachedInventory) await refreshInventory();
  return cachedInventory || [];
}

module.exports = { startInventoryCron, getCachedInventory };
