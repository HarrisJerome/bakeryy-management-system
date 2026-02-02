# Fresh Bake - Bakery Website

A simple bakery website with menu display, cart, billing, CRUD menu management, and monthly sales reporting. Built with HTML, CSS, and JavaScript. Data persists in localStorage.

## Features

- **Menu**: Display items with images, names, and prices. Click any item to add to cart.
- **Cart & Billing**: View cart, adjust quantities, see total. Pay Now (QR code), Print Bill, Clear Cart.
- **Manage Menu (Admin)**: Create, Read, Update, Delete menu items.
- **Monthly Sales Report**: Filter by month/year, view orders and revenue, copy or print.
- **Settings**: Configure UPI ID or custom QR image URL for payments.

## How to Run

1. Open `index.html` in a web browser (or use a local server).
2. For admin: open `admin.html` or click "Manage Menu & Reports" from the main page.

## File Structure

```
Bakery/
├── index.html      # Customer page (menu + cart)
├── admin.html      # Admin panel (CRUD, reports, settings)
├── css/
│   ├── style.css   # Main page styles
│   └── admin.css   # Admin styles
├── js/
│   ├── storage.js  # localStorage helpers
│   ├── app.js      # Customer page logic
│   └── admin.js    # Admin logic
└── images/         # Optional: add qr-payment.png for custom QR
```

## Payment Setup

1. Go to Admin → Settings.
2. Enter your **UPI ID** (e.g. `yourname@upi`) — a QR code will be generated with the bill amount.
3. Or enter a **Custom QR Image URL** to use your own payment QR.

## Menu Items (Default)

Egg Puffs, Veg Puffs, Pizza, Sandwich, Milkshake, Tiramisu, Cake, Falooda, Chicken Fry, Cupcakes, Donut, Burger. Edit or add more via Admin → Manage Menu.
