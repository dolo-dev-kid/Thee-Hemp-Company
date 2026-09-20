// Marketing & Retention Automation Engine
// Generates compliant SMS/Email re-engagement triggers & abandoned cart alerts

class MarketingAutomationService {
  constructor() {
    this.campaignTypes = {
      ABANDONED_RESERVATION: 'ABANDONED_RESERVATION',
      REORDER_REMINDER: 'REORDER_REMINDER',
      LOYALTY_PROMO: 'LOYALTY_PROMO'
    };
  }

  // Generate automated abandoned cart recovery draft (Compliant non-promotional SMS)
  triggerAbandonedCartSMS(patientPhone, cartItems) {
    const itemNames = cartItems.map(i => i.name).join(', ');
    const message = `Pittsburgh Dispensary: You have items reserved in your cart (${itemNames}). Complete your pickup reservation here: https://pittsburghdispensary.com/cart`;
    
    console.log(`[MARKETING SMS] Sent recovery SMS to ${patientPhone}`);
    return { status: 'SENT', recipient: patientPhone, payload: message };
  }

  // Calculate re-order timing based on product category & usage rate
  calculateReorderReminder(lastPurchaseDate, category) {
    const purchaseDate = new Date(lastPurchaseDate);
    let daysToRemind = 14; // Default 2 weeks

    if (category === 'Flower') daysToRemind = 10;
    if (category === 'Vapes' || category === 'Tinctures') daysToRemind = 21;
    if (category === 'Topicals') daysToRemind = 30;

    const reminderDate = new Date(purchaseDate);
    reminderDate.setDate(reminderDate.getDate() + daysToRemind);

    return reminderDate;
  }

  // Send compliant SMS/Email marketing notice (Meta/Facebook traffic capture)
  sendLoyaltyCampaign(patientProfile, promoTitle) {
    if (!patientProfile.optedInSMS) {
      console.log(`[MARKETING SKIPPED] Patient ${patientProfile.id} opted out of promotional messages.`);
      return { status: 'SKIPPED', reason: 'OPT_OUT' };
    }

    const message = `Pittsburgh Dispensary Loyalty: ${promoTitle}. View live inventory & reserve for pickup: https://pittsburghdispensary.com/menu`;
    console.log(`[LOYALTY CAMPAIGN] Sent to ${patientProfile.phone}`);
    
    return { status: 'SUCCESS', messageSent: message };
  }
}

module.exports = new MarketingAutomationService();
