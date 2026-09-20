// Middleware: POS Verification & Live Inventory Sync
const express = require('express');

const posSyncMiddleware = {
  // Validate Pennsylvania Medical Marijuana Card
  verifyPatientCard: (req, res, next) => {
    const { mmjCardNumber, cardExpiration } = req.body;

    if (!mmjCardNumber || !cardExpiration) {
      return res.status(400).json({ 
        error: 'Valid PA Medical Marijuana Card details required for order reservation.' 
      });
    }

    // Check expiration date
    const expirationDate = new Date(cardExpiration);
    if (expirationDate < new Date()) {
      return res.status(403).json({ error: 'Provided Medical Marijuana Card is expired.' });
    }

    req.patientVerified = true;
    next();
  },

  // Mock POS Inventory Lock (Prevents double-selling)
  syncInventoryLock: (req, res, next) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty.' });
    }

    // Standard POS reserve logic check
    console.log(`[POS SYNC] Locking ${items.length} items for pickup reservation.`);
    next();
  }
};

module.exports = posSyncMiddleware;
