# 🗄️ Storage Setup Guide: Vercel Blob + Firebase

This guide explains how to set up **Vercel Blob Storage for images** and **Firebase Firestore for data** in your cafe website.

## 📋 Architecture Overview

### **Storage Strategy:**
- **🖼️ Images**: Stored on **Vercel Blob Storage** (fast CDN, optimized delivery)
- **📊 Data**: Stored on **Firebase Firestore** (real-time database, security rules)
- **🔐 Authentication**: **Firebase Auth** (secure user management)

### **Benefits:**
- **Performance**: Images served from Vercel's global CDN
- **Cost-effective**: Vercel Blob pricing is competitive for images
- **Scalability**: Both services auto-scale with your traffic
- **Security**: Firebase handles data security, Vercel handles image delivery

## 🔥 Firebase Setup (Data Storage)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `your-cafe-name-prod`
4. Enable Google Analytics (optional)
5. Wait for project creation

### 2. Enable Firebase Services

**Firestore Database:**
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select your preferred location (choose closest to your users)
5. Click **"Done"**

**Authentication:**
1. Go to **Authentication > Sign-in method**
2. Enable **"Email/Password"** provider
3. Save changes

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **Web app** icon (`</>`)
4. Register your app: `your-cafe-website`
5. **Copy the configuration object** - you'll need this!

```javascript
// Example Firebase config (yours will be different)
const firebaseConfig = {
  apiKey: "AIzaSyBsample123456789abcdefghijklmnopqr",
  authDomain: "your-cafe-prod.firebaseapp.com",
  projectId: "your-cafe-prod",
  storageBucket: "your-cafe-prod.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

## 🌐 Vercel Blob Storage Setup (Image Storage)

### 1. Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub/GitLab/Bitbucket
3. Complete account setup

### 2. Create Blob Storage

1. Go to **Vercel Dashboard**
2. Click **"Storage"** in the sidebar
3. Click **"Create Database"**
4. Select **"Blob"**
5. Choose a name: `cafe-images`
6. Select region (same as your app deployment)
7. Click **"Create"**

### 3. Get Blob Storage Token

1. In your Blob storage dashboard
2. Go to **"Settings"** tab
3. Find **"Read Write Token"**
4. Click **"Create Token"**
5. **Copy the token** - you'll need this!

```bash
# Example token (yours will be different)
vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔧 Environment Configuration

### 1. Update Environment Files

**Edit `.env.local` (for development):**
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Generate secure keys
JWT_SECRET=your_generated_jwt_secret
ENCRYPTION_KEY=your_generated_encryption_key
```

**Edit `.env.production` (for production):**
```env
# Same as above but with production values
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ADMIN_SETUP=false
```

### 2. Generate Secure Keys

```bash
# Generate secure keys for JWT and encryption
npm run generate-keys

# Copy the generated keys to your .env files
```

## 🚀 Deployment Setup

### 1. Set Vercel Environment Variables

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
```

### 2. Deploy Firebase Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
```

### 3. Deploy to Vercel

```bash
# Deploy to production
npm run deploy

# Or manually
vercel --prod
```

## 🔒 Security Configuration

### 1. Firebase Security Rules

The project includes production-ready Firestore rules:

```javascript
// firestore.rules - Key security features:
- Public read access for products, categories, settings
- Admin-only write access for all collections
- Order creation allowed for everyone
- Admin verification for all operations
```

### 2. Vercel Blob Security

- **Public read access**: Images are publicly accessible via CDN
- **Admin-only uploads**: Only authenticated admins can upload images
- **File validation**: Size limits and type restrictions enforced
- **Automatic optimization**: Images are automatically optimized

## 📱 Using the Image Upload System

### 1. In Admin Panel

```tsx
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';

// Product image upload
<ImageUpload
  type="product"
  id={productId}
  onUploadSuccess={(result) => {
    // Update product with image URL
    updateProduct(productId, { imageUrl: result.url });
  }}
/>

// Category image upload
<ImageUpload
  type="category"
  id={categoryId}
  onUploadSuccess={(result) => {
    updateCategory(categoryId, { imageUrl: result.url });
  }}
/>
```

### 2. Image Optimization

```tsx
// Get optimized image URLs
const responsiveUrls = imageStorage.getResponsiveImageUrls(imageUrl);

// Use in components
<img 
  src={responsiveUrls.mobile} 
  srcSet={`
    ${responsiveUrls.mobile} 480w,
    ${responsiveUrls.tablet} 768w,
    ${responsiveUrls.desktop} 1200w
  `}
  sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
  alt="Product image"
/>
```

## 🎯 Testing Your Setup

### 1. Test Firebase Connection

1. Start your development server: `npm run dev`
2. Go to `/admin` and create an admin account
3. Check Firebase Console > Authentication for the new user
4. Check Firestore for admin document

### 2. Test Image Upload

1. Login to admin panel
2. Try uploading a product image
3. Check Vercel Blob Storage dashboard for the uploaded file
4. Verify image displays correctly on the website

### 3. Test Production Deployment

1. Deploy to Vercel: `npm run deploy`
2. Test admin login on production
3. Test image upload on production
4. Verify all functionality works

## 🆘 Troubleshooting

### Common Issues

**Firebase Connection Failed:**
- Check API keys in environment variables
- Verify Firebase project is active
- Check browser console for detailed errors

**Image Upload Failed:**
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check file size limits (5MB max)
- Ensure file type is supported (JPG, PNG, WebP, GIF)

**Images Not Loading:**
- Check Next.js image domains configuration
- Verify Vercel Blob URLs are accessible
- Check browser network tab for 404 errors

### Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Vercel Blob Documentation**: https://vercel.com/docs/storage/vercel-blob
- **Next.js Image Optimization**: https://nextjs.org/docs/basic-features/image-optimization

## ✅ Setup Checklist

- [ ] Firebase project created and configured
- [ ] Firestore database enabled
- [ ] Firebase Authentication enabled
- [ ] Firebase configuration copied to environment files
- [ ] Vercel account created
- [ ] Vercel Blob storage created
- [ ] Blob storage token copied to environment files
- [ ] Environment variables set in Vercel dashboard
- [ ] Firebase security rules deployed
- [ ] Application deployed to Vercel
- [ ] Admin account created and tested
- [ ] Image upload functionality tested
- [ ] Production deployment verified

🎉 **Your storage setup is complete! Images will be stored on Vercel Blob and data on Firebase.**
