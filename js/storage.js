/**
 * Bakery - localStorage helpers for menu, cart, and orders
 */

const STORAGE_KEYS = {
  MENU: 'bakery_menuItems',
  CART: 'bakery_cart',
  ORDERS: 'bakery_orderHistory',
  SETTINGS: 'bakery_settings'
};

const DEFAULT_MENU = [
  { id: '1', name: 'Egg Puffs', price: 45, image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=400', category: 'Snacks' },
  { id: '2', name: 'Veg Puffs', price: 40, image: 'https://images.pexels.com/photos/6287525/pexels-photo-6287525.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Snacks' },
  { id: '3', name: 'Pizza', price: 120, image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Main' },
  { id: '4', name: 'Sandwich', price: 80, image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Main' },
  { id: '5', name: 'Milkshake', price: 90, image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beverages' },
  { id: '6', name: 'Tiramisu', price: 150, image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Desserts' },
  { id: '7', name: 'Cake', price: 100, image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Desserts' },
  { id: '8', name: 'Falooda', price: 110, image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beverages' },
  { id: '9', name: 'Chicken Fry', price: 130, image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Main' },
  { id: '10', name: 'Cupcakes', price: 60, image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Desserts' },
  { id: '11', name: 'Donut', price: 50, image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Desserts' },
  { id: '12', name: 'Burger', price: 95, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Main' }
];

function getMenu() {
  const data = localStorage.getItem(STORAGE_KEYS.MENU);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU));
    return DEFAULT_MENU;
  }
  return JSON.parse(data);
}

function setMenu(menuItems) {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
}

function getCart() {
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  return data ? JSON.parse(data) : [];
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function getOrders() {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
}

function addOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

function getSettings() {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : { upiId: '', qrImageUrl: '' };
}

function setSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
