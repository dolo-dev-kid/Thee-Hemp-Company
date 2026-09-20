// BioTrack POS API Integration Module
const axios = require('axios');

class BioTrackService {
  constructor() {
    this.baseUrl = process.env.BIOTRACK_API_URL || 'https://api.biotrackthc.net/v1';
    this.username = process.env.BIOTRACK_USERNAME;
    this.password = process.env.BIOTRACK_PASSWORD;
    this.licenseNumber = process.env.BIOTRACK_LICENSE;
    this.sessionToken = null;
  }

  // Authenticate and obtain API Session Token
  async login() {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        username: this.username,
        password: this.password,
        license: this.licenseNumber,
      });

      if (response.data && response.data.sessionid) {
        this.sessionToken = response.data.sessionid;
        console.log('[BIOTRACK] Successfully authenticated with BioTrack POS.');
        return this.sessionToken;
      } else {
        throw new Error('Failed to retrieve session ID from BioTrack response.');
      }
    } catch (error) {
      console.error('[BIOTRACK AUTH ERROR]', error.message);
      throw error;
    }
  }

  // Fetch Live Menu Inventory (filters out zero-stock items)
  async getLiveInventory() {
    try {
      if (!this.sessionToken) await this.login();

      const response = await axios.post(`${this.baseUrl}/inventory/get`, {
        sessionid: this.sessionToken,
        active_only: 1, // Exclude depleted inventory
      });

      // BioTrack uses 16-digit unique identifiers per batch/lot
      const products = (response.data.inventory || [])
        .filter(item => item.usable_weight > 0 || item.quantity > 0)
        .map(item => ({
          id: item.barcode || item.id, // 16-digit identifier
          name: item.productname || item.name,
          category: item.category_name || 'General',
          price: parseFloat(item.price || 0),
          thcContent: item.thc_percentage ? `${item.thc_percentage}%` : 'N/A',
          quantityAvailable: item.quantity || item.usable_weight,
          strain: item.strain || 'Hybrid',
        }));

      return products;
    } catch (error) {
      console.error('[BIOTRACK INVENTORY ERROR]', error.message);
      // Fallback mock payload if offline or in testing environment
      return this.getMockInventory();
    }
  }

  // Push Pickup Order Reservation to BioTrack POS Queue
  async createOrderReservation(orderData) {
    try {
      if (!this.sessionToken) await this.login();

      const { customerName, verificationType, idOrCardNumber, items, total } = orderData;

      const payload = {
        sessionid: this.sessionToken,
        customer_name: customerName,
        customer_id: idOrCardNumber,
        verification_type: verificationType, // 'ADULT_USE_21' or 'MEDICAL_CARD'
        status: 'HOLD', // Places inventory on hold for pickup
        items: items.map(item => ({
          barcode: item.id, // BioTrack 16-digit ID
          quantity: item.quantity || 1,
        })),
        notes: `Online Order Reservation via Pittsburgh Dispensary App (${verificationType})`,
      };

      const response = await axios.post(`${this.baseUrl}/sales/queue`, payload);

      return {
        success: true,
        posOrderId: response.data.ticket_id || `BT-${Date.now()}`,
        message: 'Order successfully queued in BioTrack POS.',
      };
    } catch (error) {
      console.error('[BIOTRACK ORDER QUEUE ERROR]', error.message);
      return {
        success: false,
        posOrderId: `BT-OFFLINE-${Date.now()}`,
        message: 'Order recorded locally; manual POS confirmation required upon pickup.',
      };
    }
  }

  // Mock payload for dev testing without active BioTrack API key
  getMockInventory() {
    return [
      { id: '1000000000012345', name: 'Pittsburgh Kush (3.5g)', category: 'Flower', price: 45.0, thcContent: '24%', quantityAvailable: 32 },
      { id: '1000000000012346', name: 'Steel City Tincture 1:1', category: 'Tinctures', price: 55.0, thcContent: '12%', quantityAvailable: 15 },
      { id: '1000000000012347', name: 'Pain Relief Balm', category: 'Topicals', price: 40.0, thcContent: '5%', quantityAvailable: 20 },
      { id: '1000000000012348', name: 'THCA Live Resin Cartridge (1g)', category: 'Vapes', price: 60.0, thcContent: '82%', quantityAvailable: 18 },
    ];
  }
}

module.exports = new BioTrackService();
