import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert 
} from 'react-native';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Granddaddy Purple (3.5g)', category: 'Flower', price: 45.00, THC: '22%' },
  { id: '2', name: '1:1 Tincture (30ml)', category: 'Tinctures', price: 55.00, THC: '10%' },
  { id: '3', name: 'Relief Balm (2oz)', category: 'Topicals', price: 40.00, THC: '5%' },
  { id: '4', name: 'Sativa Vape Cart (1g)', category: 'Vapes', price: 65.00, THC: '85%' },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  const handleReserveOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add products before reserving.');
      return;
    }

    Alert.alert(
      'Order Reserved!',
      `Total: $${total.toFixed(2)}. Please show your PA MMJ Card at pickup at Pittsburgh Dispensary.`,
      [{ text: 'OK', onPress: () => { setCart([]); setTotal(0); } }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pittsburgh Dispensary</Text>
        <Text style={styles.subtitle}>Medical Cannabis Menu</Text>
      </View>

      <FlatList
        data={MOCK_PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productMeta}>{item.category} • THC: {item.THC}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)} ({cart.length} items)</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleReserveOrder}>
          <Text style={styles.checkoutButtonText}>Reserve for Pickup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { padding: 20, backgroundColor: '#1b4332' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#d8f3dc', marginTop: 4 },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#2d6a4f' },
  productMeta: { fontSize: 12, color: '#666', marginVertical: 4 },
  productPrice: { fontSize: 15, fontWeight: '600', color: '#1b4332' },
  addButton: { backgroundColor: '#2d6a4f', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
  checkoutButton: { backgroundColor: '#1b4332', padding: 16, borderRadius: 8, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
