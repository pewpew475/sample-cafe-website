# Vercel Deployment Guide

This guide will help you deploy your Sample Cafe Website to Vercel with proper environment variable configuration.

## 🚀 Quick Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variables in Vercel

You need to set the following environment variables in your Vercel project. You can do this either through the Vercel dashboard or using the CLI.

#### Option A: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and navigate to your project
2. Go to Settings → Environment Variables
3. Add each variable from your `.env.local` file:

#### Option B: Using Vercel CLI
Run these commands in your project directory:

```bash
# Firebase Configuration (REQUIRED)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Application Settings (REQUIRED)
vercel env add NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_APP_URL

# Security Settings (REQUIRED)
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY

# Environment Settings (REQUIRED)
vercel env add NODE_ENV

# Firebase Admin Setup (REQUIRED)
vercel env add NEXT_PUBLIC_ENABLE_ADMIN_SETUP

# Business Information (OPTIONAL)
vercel env add NEXT_PUBLIC_PHONE
vercel env add NEXT_PUBLIC_EMAIL
vercel env add NEXT_PUBLIC_ADDRESS
vercel env add NEXT_PUBLIC_HOURS_WEEKDAY
vercel env add NEXT_PUBLIC_HOURS_WEEKEND

# Social Media (OPTIONAL)
vercel env add NEXT_PUBLIC_FACEBOOK_URL
vercel env add NEXT_PUBLIC_INSTAGRAM_URL
vercel env add NEXT_PUBLIC_TWITTER_URL

# Legacy Admin (OPTIONAL)
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
```

### 4. Deploy to Vercel
```bash
vercel --prod
```

## 📋 Environment Variables Reference

Copy the values from your `.env.local` file:

### Required Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBUzV9cj6lxAy7CayVfo3-MQk5_ZJoNRx0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sample-cafe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sample-cafe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sample-cafe-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=946719851074
NEXT_PUBLIC_FIREBASE_APP_ID=1:946719851074:web:94420bf73039a4fd2423db
NEXT_PUBLIC_APP_NAME="Sample Cafe"
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
JWT_SECRET=ICdUbl2BBlU3McOr2JtAdm7h3rPc0VVVS8tqL5n0I5L7gNjBZX4UXTz/JjeftfFJ6blFez0RkejCI+OPeDX9Uw==
ENCRYPTION_KEY=5277dc9cc0d76b486d5499ce72a95002b06c341d86b1f4502f74133f011b098c
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ADMIN_SETUP=true
```

### Optional Variables
```env
NEXT_PUBLIC_PHONE=+1-555-CAFE-123
NEXT_PUBLIC_EMAIL=info@samplecafe.com
NEXT_PUBLIC_ADDRESS="123 Coffee Street, Brew City, BC 12345"
NEXT_PUBLIC_HOURS_WEEKDAY="7:00 AM - 9:00 PM"
NEXT_PUBLIC_HOURS_WEEKEND="8:00 AM - 10:00 PM"
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/samplecafe
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/samplecafe
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/samplecafe
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## 🔧 Troubleshooting

### Build Fails with Firebase Environment Variables Error
If you see this error during deployment:
```
Error: Missing required Firebase environment variables
```

1. **Check Environment Variables**: Ensure all required variables are set in Vercel
2. **Verify Values**: Make sure the values match your `.env.local` file
3. **Redeploy**: After adding variables, trigger a new deployment

### Environment Variables Not Loading
1. Make sure variables are set for the correct environment (Production)
2. Check that variable names are exactly correct (case-sensitive)
3. Ensure `NEXT_PUBLIC_` prefix is included for client-side variables

## 🎯 Post-Deployment Steps

1. **Update Firebase Configuration**: Update your Firebase project's authorized domains to include your Vercel domain
2. **Test Admin Access**: Visit `https://your-domain.vercel.app/admin` to set up your admin account
3. **Update App URL**: Change `NEXT_PUBLIC_APP_URL` to your actual Vercel domain
4. **Test All Features**: Verify that all functionality works in production

## 📞 Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure your Firebase project is properly configured
4. Test locally first with `npm run build` and `npm start`
