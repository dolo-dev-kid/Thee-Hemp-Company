const express = require('express');
const cors = require('cors');
const posSyncMiddleware = require('./posSyncMiddleware');
const { startInventoryCron, getCachedInventory } = require('./cronSync');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health Check Route for Render
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', service: 'Pittsburgh Dispensary Local POS API' });
});

// Fast Menu Endpoint (Serves internal inventory)
app.get('/api/products', async (req, res) => {
  try {
    const products = await getCachedInventory();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to serve product menu.' });
  }
});

// Reserve Order Route (Direct local pickup queue)
app.post(
  '/api/orders/reserve',
  posSyncMiddleware.verifyCustomerIdentity,
  posSyncMiddleware.syncInventoryLock,
  async (req, res) => {
    const { customerName, idNumber, mmjCardNumber, verificationType, items, totalAmount } = req.body;
    const idOrCardNumber = verificationType === 'MEDICAL_CARD' ? mmjCardNumber : idNumber;

    const orderId = `ORD-${Date.now()}`;
    console.log(`[LOCAL POS] Reservation Created: ${orderId} for ${customerName}`);

    res.status(201).json({
      message: 'Order reservation completed successfully.',
      verificationStatus: req.verificationDetails,
      posResult: {
        success: true,
        orderId: orderId,
        customer: customerName,
        idRef: idOrCardNumber,
        total: totalAmount,
        status: 'READY_FOR_PICKUP_VERIFICATION'
      }
    });
  }
);

// Bind to process.env.PORT and 0.0.0.0 for Render compatibility
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  startInventoryCron();
});
