// Middleware: POS Verification & Live Inventory Sync
const express = require('express');

const posSyncMiddleware = {
  // Validate customer identity for a pickup reservation.
  // server.js sends verificationType 'MEDICAL_CARD' or adult-use (21+).
  // Medical: PA MMJ card number + unexpired card. Adult-use: government ID number.
  verifyCustomerIdentity: (req, res, next) => {
    const { verificationType, idNumber, mmjCardNumber, cardExpiration } = req.body;

    if (verificationType === 'MEDICAL_CARD') {
      if (!mmjCardNumber || !cardExpiration) {
        return res.status(400).json({
          error: 'Valid PA Medical Marijuana Card details required for order reservation.'
        });
      }
      const expirationDate = new Date(cardExpiration);
      if (expirationDate < new Date()) {
        return res.status(403).json({ error: 'Provided Medical Marijuana Card is expired.' });
      }
      req.verificationDetails = { type: 'MEDICAL_CARD', verified: true };
      req.patientVerified = true;
      return next();
    }

    if (!idNumber) {
      return res.status(400).json({
        error: 'Valid government ID number required for adult-use (21+) pickup reservation.'
      });
    }
    req.verificationDetails = { type: 'ADULT_USE_21', verified: true };
    next();
  },

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
