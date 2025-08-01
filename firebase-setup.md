# 🔥 Firebase Database Setup Guide for Sample Cafe Website

This guide will walk you through setting up Firebase for your cafe website, including Firestore database, Authentication, and Security Rules.

## 📋 Prerequisites

- Node.js installed (v18 or higher)
- A Google account
- Firebase CLI installed: `npm install -g firebase-tools`

## 🚀 Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Create a project" or "Add project"

2. **Project Setup**
   - **Project name**: `sample-cafe-website` (or your preferred name)
   - **Google Analytics**: Enable (recommended for tracking)
   - **Analytics account**: Choose existing or create new
   - Click "Create project"

3. **Wait for project creation** (usually takes 1-2 minutes)

## 🔧 Step 2: Configure Firebase Services

### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

### Enable Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. **Security rules**: Start in **test mode** (we'll secure it later)
4. **Location**: Choose closest to your users (e.g., `us-central1`)
5. Click "Done"

### Enable Storage (Optional)
1. Go to **Storage**
2. Click "Get started"
3. **Security rules**: Start in test mode
4. **Location**: Same as Firestore
5. Click "Done"

## 🔑 Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app icon** (`</>`)
4. **App nickname**: `sample-cafe-web`
5. **Firebase Hosting**: Check if you want hosting
6. Click "Register app"
7. **Copy the configuration object**

## 📝 Step 4: Update Environment Variables

Replace the values in your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🛡️ Step 5: Set Up Security Rules

### Firestore Security Rules
Go to **Firestore Database** > **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection - only the user can access their own data
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Products collection - read for all, write for authenticated admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categories collection - read for all, write for authenticated admins only
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders collection - write for all (customers), read/update for authenticated admins
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Settings collection - read for all, write for authenticated admins only
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Counters collection - read/write for authenticated admins only
    match /counters/{counterId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules (if using Storage)
Go to **Storage** > **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - read for all, write for authenticated admins
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Other files - authenticated admins only
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🗄️ Step 6: Initialize Database Structure

Run the database initialization script:

```bash
node scripts/init-firebase.js
```

This will create:
- **Collections**: products, categories, orders, settings, counters, admins
- **Sample data**: Default categories and settings
- **Order counter**: Starting at 0

## 🔐 Step 7: Create First Admin Account

1. **Start your development server**: `npm run dev`
2. **Visit**: http://localhost:3000/admin
3. **You'll see the admin setup page**
4. **Fill in your details**:
   - Email: your-email@example.com
   - Username: admin
   - Password: (secure password)
5. **Click "Create Admin Account"**

## ✅ Step 8: Test the Setup

1. **Admin Login**: Try logging in with your new admin account
2. **Add Products**: Go to Products tab and add a sample product
3. **Create Order**: Visit the main site and place a test order
4. **Check Firebase**: Verify data appears in Firestore console

## 🚨 Production Deployment

### Before going live:

1. **Update Security Rules**: Make them more restrictive
2. **Environment Variables**: Use production Firebase project
3. **Generate New Keys**: Run `node generate-keys.js` for production
4. **Enable Backup**: Set up Firestore backup rules
5. **Monitor Usage**: Set up billing alerts

## 📊 Database Collections Structure

Your Firestore will have these collections:

- **`admins`**: Admin user profiles
- **`products`**: Menu items and products
- **`categories`**: Product categories
- **`orders`**: Customer orders
- **`settings`**: Restaurant settings
- **`counters`**: Order number counter

## 🔧 Useful Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 🆘 Troubleshooting

**Common Issues:**

1. **Permission Denied**: Check security rules and authentication
2. **Network Error**: Verify Firebase config in .env.local
3. **Quota Exceeded**: Check Firebase usage in console
4. **Build Errors**: Ensure all Firebase packages are installed

**Need Help?**
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support

---

🎉 **Your Firebase database is now ready for your cafe website!**
