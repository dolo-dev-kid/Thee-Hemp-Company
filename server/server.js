const express = require('express');
const cors = require('cors');
const bioTrackService = require('./biotrackService');
const posSyncMiddleware = require('./posSyncMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Live Menu Endpoint synced with BioTrack
app.get('/api/products', async (req, res) => {
  try {
    const inventory = await bioTrackService.getLiveInventory();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve BioTrack inventory.' });
  }
});

// Reserve Order Route using BioTrack Queue & ID Verification
app.post(
  '/api/orders/reserve',
  posSyncMiddleware.verifyCustomerIdentity,
  posSyncMiddleware.syncInventoryLock,
  async (req, res) => {
    const { customerName, idNumber, mmjCardNumber, verificationType, items, totalAmount } = req.body;

    const idOrCardNumber = verificationType === 'MEDICAL_CARD' ? mmjCardNumber : idNumber;

    const orderResult = await bioTrackService.createOrderReservation({
      customerName,
      verificationType,
      idOrCardNumber,
      items,
      total: totalAmount,
    });

    res.status(201).json({
      message: 'Order reservation process finished.',
      verificationStatus: req.verificationDetails,
      posResult: orderResult,
    });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} with BioTrack POS integration.`));
