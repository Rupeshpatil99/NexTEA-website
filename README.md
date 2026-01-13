# NexTEA - Tea Ordering Website

A modern, responsive tea ordering website with cart functionality and order management system.

## Features

- 🍵 **Tea Catalog**: Browse and view different types of teas
- 🛒 **Shopping Cart**: Add items to cart with real-time updates
- 📝 **Order Management**: Place and manage orders
- 💾 **Database System**: LocalStorage-based database for cart and orders
- 📊 **Excel Export**: Export cart and orders to CSV format (Excel-compatible)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✨ **Interactive UI**: Smooth animations and modern user interface
- 🔐 **Login System**: User authentication page

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- JavaScript (ES6+)
- LocalStorage API
- CSV Export functionality

## Project Structure

```
nescafe/
├── index.html          # Home page
├── login.html          # Login page
├── order.html          # Order form page
├── cart.html           # Shopping cart page
├── rp.css              # Main stylesheet
├── script.js           # Main JavaScript file
├── cup.png             # Logo image
└── README.md           # Project documentation
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No server required - runs directly in the browser!

## Usage

### Adding Items to Cart
- Click the "Order" button on any tea card on the home page
- Items are automatically added to the cart

### Viewing Cart
- Click "Cart" in the navigation menu
- View all items, quantities, and prices
- Remove items using the "Remove" button

### Placing Orders
1. Fill out the order form with customer details
2. Submit the form
3. Order is saved to the database and added to cart

### Exporting Data
- **Export Cart**: Click "Export Cart to Excel" button on cart page
- **Export Orders**: Click "Export All Orders to Excel" button on cart page
- Files are downloaded in CSV format (Excel-compatible)

## Database

The project uses browser LocalStorage as a database:
- **Cart Data**: Stored in `localStorage.cart`
- **Orders Data**: Stored in `localStorage.orders`

Data persists between browser sessions.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari
- Opera

## License

This project is open source and available for educational purposes.

## Author

NexTEA Website Project

---

Enjoy your tea! ☕
