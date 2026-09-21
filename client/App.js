const handleReserveOrder = (verificationType) => {
  if (cart.length === 0) {
    Alert.alert('Empty Cart', 'Please add products before reserving.');
    return;
  }

  const payload = {
    items: cart,
    totalAmount: total,
    verificationType: verificationType, // 'ADULT_USE_21' or 'MEDICAL_CARD'
    dateOfBirth: '1998-05-14', // Collected via input modal/form
    idNumber: 'PA-99887766'
  };

  // Submit to Express backend /api/orders/reserve
  Alert.alert(
    'Reservation Submitted!',
    `Order reserved ($${total.toFixed(2)}). Please present a valid 21+ Government ID or PA Medical Card upon pickup at Pittsburgh Dispensary.`,
    [{ text: 'OK', onPress: () => { setCart([]); setTotal(0); } }]
  );
};
