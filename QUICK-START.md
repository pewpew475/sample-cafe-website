# ⚡ Quick Start Guide

Get your cafe website running in production in 15 minutes!

## 🎯 What You'll Get

- **🖼️ Images**: Stored on Vercel Blob (fast CDN)
- **📊 Data**: Stored on Firebase Firestore
- **🔐 Auth**: Firebase Authentication
- **🌐 Hosting**: Vercel deployment

## 🚀 Quick Setup (15 minutes)

### 1. Firebase Setup (5 minutes)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project"
   - Name: `your-cafe-prod`
   - Enable Google Analytics (optional)

2. **Enable Services**
   - **Firestore**: Database > Create database > Production mode
   - **Auth**: Authentication > Sign-in method > Enable Email/Password

3. **Get Config**
   - Project Settings > Your apps > Web app
   - Copy the config object

### 2. Vercel Setup (3 minutes)

1. **Create Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Create Blob Storage**
   - Dashboard > Storage > Create Database > Blob
   - Name: `cafe-images`
   - Copy the Read Write Token

### 3. Environment Setup (2 minutes)

1. **Update `.env.local`**:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Generate these
JWT_SECRET=your_64_char_secret
ENCRYPTION_KEY=your_32_char_key
```

2. **Generate Secure Keys**:
```bash
npm run generate-keys
```

### 4. Deploy (5 minutes)

1. **Install CLIs**:
```bash
npm install -g firebase-tools vercel
```

2. **Login & Setup**:
```bash
firebase login
vercel login
```

3. **Deploy**:
```bash
# Deploy Firebase rules
firebase init
firebase deploy --only firestore:rules

# Deploy to Vercel
npm run deploy
```

## ✅ Test Your Setup

1. **Local Testing**:
```bash
npm run dev
# Visit http://localhost:3000/admin
```

2. **Create Admin Account**:
   - Go to `/admin`
   - Create your first admin account
   - Check Firebase Console > Authentication

3. **Test Image Upload**:
   - Login to admin panel
   - Add a product with image
   - Check Vercel Dashboard > Storage

4. **Production Testing**:
   - Visit your Vercel URL
   - Test all functionality

## 🆘 Quick Troubleshooting

**Firebase Connection Issues:**
- Check API keys in `.env.local`
- Verify project is active in Firebase Console

**Image Upload Issues:**
- Check `BLOB_READ_WRITE_TOKEN` is correct
- Verify file size < 5MB

**Deployment Issues:**
- Run `vercel env ls` to check environment variables
- Check build logs in Vercel dashboard

## 📚 Detailed Guides

- **📖 STORAGE-SETUP.md**: Complete setup instructions
- **🚀 DEPLOYMENT.md**: Detailed deployment guide
- **✅ PRODUCTION-CHECKLIST.md**: Pre-launch checklist

## 🎉 You're Done!

Your cafe website is now running with:
- ⚡ Fast image delivery via Vercel CDN
- 🔒 Secure data storage on Firebase
- 📱 Mobile-responsive design
- 🛡️ Production-ready security

**Next Steps:**
1. Customize your menu and settings
2. Add your branding and colors
3. Test ordering flow
4. Launch! 🚀
