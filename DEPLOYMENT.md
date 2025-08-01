# 🚀 Production Deployment Guide

This guide will help you deploy your Sample Cafe Website to production using Firebase and Vercel.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Firebase account
- Vercel account
- Domain name (optional)

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `your-cafe-name-prod`
4. Enable Google Analytics (optional)
5. Wait for project creation

### 2. Enable Firebase Services

**Authentication:**
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Save changes

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred location
5. Click "Done"

**Storage:**
1. Go to Storage
2. Click "Get started"
3. Choose "Start in production mode"
4. Select same location as Firestore
5. Click "Done"

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon
4. Register your app: `your-cafe-website`
5. Copy the configuration object

### 4. Set Up Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
cd your-project-directory
./scripts/setup-firebase.sh
```

## 🌐 Vercel Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Your Project

```bash
vercel link
```

## 🔧 Environment Configuration

### 1. Create Production Environment

```bash
# Copy production template
cp .env.production .env.production.local

# Generate secure keys
node generate-keys.js
```

### 2. Update Production Variables

Edit `.env.production.local` with your actual values:

```env
# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Settings
NEXT_PUBLIC_APP_NAME="Your Cafe Name"
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Security (use generated keys)
JWT_SECRET=your_generated_jwt_secret
ENCRYPTION_KEY=your_generated_encryption_key

# Business Information
NEXT_PUBLIC_PHONE=+1-555-YOUR-CAFE
NEXT_PUBLIC_EMAIL=info@yourcafe.com
NEXT_PUBLIC_ADDRESS="Your Actual Address"
```

### 3. Set Vercel Environment Variables

```bash
# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_APP_URL
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
vercel env add NODE_ENV production

# Optional business variables
vercel env add NEXT_PUBLIC_PHONE
vercel env add NEXT_PUBLIC_EMAIL
vercel env add NEXT_PUBLIC_ADDRESS
```

## 🚀 Deployment

### Automated Deployment

```bash
# Run the deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Manual Deployment

```bash
# 1. Build the application
npm run build

# 2. Deploy Firebase rules
firebase deploy --only firestore:rules,storage:rules

# 3. Deploy to Vercel
vercel --prod
```

## 🔒 Security Configuration

### 1. Firebase Security Rules

The following security rules are automatically deployed:

**Firestore Rules:**
- Public read access for products, categories, settings
- Admin-only write access for all collections
- Order creation allowed for everyone
- Admin verification for all write operations

**Storage Rules:**
- Public read access for product/category images
- Admin-only upload/delete permissions
- 5MB file size limit
- Image files only

### 2. Vercel Security Headers

Security headers are configured in `vercel.json`:
- Content Security Policy
- XSS Protection
- Frame Options
- Referrer Policy

## 🎯 Post-Deployment Setup

### 1. Configure Firebase Authorized Domains

1. Go to Firebase Console > Authentication > Settings
2. Add your Vercel domain to "Authorized domains"
3. Example: `your-cafe.vercel.app`

### 2. Create Admin Account

1. Visit your deployed website
2. Go to `/admin`
3. Complete the admin setup form
4. Set `NEXT_PUBLIC_ENABLE_ADMIN_SETUP=false` after setup

### 3. Add Initial Data

1. Login to admin panel
2. Add product categories
3. Add products with images
4. Configure restaurant settings

## 🔧 Maintenance

### Update Deployment

```bash
# Update code
git add .
git commit -m "Update website"
git push

# Redeploy
vercel --prod
```

### Monitor Performance

- **Vercel Analytics**: Monitor website performance
- **Firebase Console**: Monitor database usage
- **Error Tracking**: Check Vercel function logs

### Backup Data

```bash
# Export Firestore data
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**: Check environment variables
2. **Firebase Connection**: Verify API keys and project ID
3. **Admin Login**: Ensure Firebase Auth is enabled
4. **Images Not Loading**: Check Storage rules and CORS

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## ✅ Production Checklist

- [ ] Firebase project created and configured
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Security rules deployed
- [ ] Environment variables set in Vercel
- [ ] Application deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] Admin account created
- [ ] Initial data added
- [ ] SSL certificate active
- [ ] Performance monitoring enabled

🎉 **Congratulations! Your cafe website is now live in production!**
