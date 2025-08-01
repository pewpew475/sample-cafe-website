#!/usr/bin/env node

/**
 * Firebase Database Initialization Script
 * 
 * This script initializes your Firebase Firestore database with:
 * - Default categories
 * - Sample products
 * - Restaurant settings
 * - Order counter
 * 
 * Run with: node scripts/init-firebase.js
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  serverTimestamp 
} = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate configuration
function validateConfig() {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease update your .env.local file with your Firebase configuration.');
    process.exit(1);
  }
}

// Initialize Firebase
let app, db;

try {
  validateConfig();
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
  process.exit(1);
}

// Sample data
const sampleCategories = [
  {
    name: 'Coffee',
    description: 'Fresh brewed coffee and espresso drinks',
    isActive: true
  },
  {
    name: 'Tea',
    description: 'Premium teas and herbal blends',
    isActive: true
  },
  {
    name: 'Pastries',
    description: 'Fresh baked pastries and desserts',
    isActive: true
  },
  {
    name: 'Sandwiches',
    description: 'Gourmet sandwiches and wraps',
    isActive: true
  },
  {
    name: 'Salads',
    description: 'Fresh and healthy salad options',
    isActive: true
  }
];

const sampleProducts = [
  {
    name: 'Espresso',
    description: 'Rich and bold espresso shot',
    price: 2.50,
    category: 'Coffee',
    image: '/main images/espresso.jpg',
    isAvailable: true,
    isPopular: true
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 4.25,
    category: 'Coffee',
    image: '/main images/cappuccino.jpg',
    isAvailable: true,
    isPopular: true
  },
  {
    name: 'Latte',
    description: 'Smooth espresso with steamed milk',
    price: 4.75,
    category: 'Coffee',
    image: '/main images/latte.jpg',
    isAvailable: true,
    isPopular: false
  },
  {
    name: 'Green Tea',
    description: 'Premium organic green tea',
    price: 3.00,
    category: 'Tea',
    image: '/main images/green-tea.jpg',
    isAvailable: true,
    isPopular: false
  },
  {
    name: 'Croissant',
    description: 'Buttery, flaky French croissant',
    price: 3.50,
    category: 'Pastries',
    image: '/main images/croissant.jpg',
    isAvailable: true,
    isPopular: true
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker with turkey, bacon, and fresh vegetables',
    price: 8.95,
    category: 'Sandwiches',
    image: '/main images/club-sandwich.jpg',
    isAvailable: true,
    isPopular: true
  }
];

const defaultSettings = {
  restaurantName: 'Sample Cafe',
  address: '123 Coffee Street, Brew City, BC 12345',
  phone: '+1-555-CAFE-123',
  email: 'info@samplecafe.com',
  hours: {
    monday: '7:00 AM - 9:00 PM',
    tuesday: '7:00 AM - 9:00 PM',
    wednesday: '7:00 AM - 9:00 PM',
    thursday: '7:00 AM - 9:00 PM',
    friday: '7:00 AM - 10:00 PM',
    saturday: '8:00 AM - 10:00 PM',
    sunday: '8:00 AM - 8:00 PM'
  },
  socialMedia: {
    facebook: 'https://facebook.com/samplecafe',
    instagram: 'https://instagram.com/samplecafe',
    twitter: 'https://twitter.com/samplecafe'
  },
  currency: 'USD',
  taxRate: 0.08,
  isOpen: true,
  acceptsOnlineOrders: true
};

// Initialization functions
async function initializeCategories() {
  console.log('📂 Initializing categories...');
  
  try {
    for (const category of sampleCategories) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: serverTimestamp()
      });
    }
    console.log(`✅ Created ${sampleCategories.length} categories`);
  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
  }
}

async function initializeProducts() {
  console.log('🍕 Initializing products...');
  
  try {
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log(`✅ Created ${sampleProducts.length} products`);
  } catch (error) {
    console.error('❌ Error creating products:', error.message);
  }
}

async function initializeSettings() {
  console.log('⚙️ Initializing settings...');
  
  try {
    await addDoc(collection(db, 'settings'), defaultSettings);
    console.log('✅ Created default settings');
  } catch (error) {
    console.error('❌ Error creating settings:', error.message);
  }
}

async function initializeCounters() {
  console.log('🔢 Initializing counters...');
  
  try {
    await setDoc(doc(db, 'counters', 'orderNumber'), {
      value: 0,
      lastUpdated: serverTimestamp()
    });
    console.log('✅ Created order counter');
  } catch (error) {
    console.error('❌ Error creating counters:', error.message);
  }
}

// Main initialization function
async function initializeDatabase() {
  console.log('🔥 FIREBASE DATABASE INITIALIZATION');
  console.log('===================================\n');
  
  console.log(`📊 Project: ${firebaseConfig.projectId}`);
  console.log(`🌍 Region: ${firebaseConfig.authDomain}\n`);
  
  try {
    await initializeCategories();
    await initializeProducts();
    await initializeSettings();
    await initializeCounters();
    
    console.log('\n🎉 DATABASE INITIALIZATION COMPLETE!');
    console.log('\n📋 What was created:');
    console.log(`   • ${sampleCategories.length} product categories`);
    console.log(`   • ${sampleProducts.length} sample products`);
    console.log('   • Restaurant settings');
    console.log('   • Order number counter');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Visit http://localhost:3000/admin');
    console.log('   3. Create your first admin account');
    console.log('   4. Start managing your cafe!');
    
  } catch (error) {
    console.error('\n❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
