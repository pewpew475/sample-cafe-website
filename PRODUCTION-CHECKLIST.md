# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Firebase Project Setup
- [ ] Create Firebase project at [Firebase Console](https://console.firebase.google.com)
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore database (production mode)
- [ ] Create Storage bucket
- [ ] Copy Firebase configuration values

### 2. Environment Configuration
- [ ] Run `node generate-keys.js` to generate secure keys
- [ ] Update `.env.production` with real Firebase config
- [ ] Set `NODE_ENV=production`
- [ ] Set `NEXT_PUBLIC_ENABLE_ADMIN_SETUP=true` (initially)
- [ ] Configure business information variables

### 3. Security Setup
- [ ] Deploy Firestore security rules: `npm run deploy:firebase`
- [ ] Verify Storage security rules are deployed
- [ ] Test security rules in Firebase Console

## 🌐 Vercel Deployment

### 1. Vercel Account Setup
- [ ] Create Vercel account
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`

### 2. Environment Variables in Vercel
Set these in Vercel dashboard or CLI:

**Required:**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_APP_NAME`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `JWT_SECRET`
- [ ] `ENCRYPTION_KEY`
- [ ] `NODE_ENV=production`

**Optional:**
- [ ] `NEXT_PUBLIC_PHONE`
- [ ] `NEXT_PUBLIC_EMAIL`
- [ ] `NEXT_PUBLIC_ADDRESS`
- [ ] Business hours and social media variables

### 3. Deploy to Vercel
- [ ] Run `npm run deploy` or `vercel --prod`
- [ ] Verify deployment is successful
- [ ] Test website functionality

## 🔒 Post-Deployment Security

### 1. Firebase Configuration
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test Firebase authentication from production
- [ ] Verify Firestore rules are working
- [ ] Test Storage upload/download permissions

### 2. Admin Setup
- [ ] Visit `/admin` on production site
- [ ] Create first admin account
- [ ] Test admin login functionality
- [ ] Set `NEXT_PUBLIC_ENABLE_ADMIN_SETUP=false`
- [ ] Redeploy with admin setup disabled

### 3. Security Verification
- [ ] Test that non-admin users cannot access admin functions
- [ ] Verify HTTPS is working
- [ ] Check security headers are applied
- [ ] Test CORS policies

## 📊 Content Setup

### 1. Initial Data
- [ ] Login to admin panel
- [ ] Add product categories
- [ ] Add products with images
- [ ] Configure restaurant settings
- [ ] Test order placement flow

### 2. Business Information
- [ ] Update contact information
- [ ] Set business hours
- [ ] Add social media links
- [ ] Upload logo and banner images

## 🔧 Performance & Monitoring

### 1. Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Configure image optimization
- [ ] Test mobile responsiveness
- [ ] Verify loading speeds

### 2. Monitoring Setup
- [ ] Monitor Firebase usage quotas
- [ ] Set up error tracking
- [ ] Configure backup procedures
- [ ] Test disaster recovery

## 🌍 Domain & SSL

### 1. Custom Domain (Optional)
- [ ] Purchase domain name
- [ ] Configure DNS settings
- [ ] Add domain to Vercel
- [ ] Verify SSL certificate

### 2. SEO Setup
- [ ] Configure meta tags
- [ ] Set up Google Analytics (optional)
- [ ] Submit sitemap to search engines
- [ ] Test social media sharing

## 🚨 Final Verification

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] Menu displays products
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] Admin login works
- [ ] Admin dashboard functions
- [ ] Product management works
- [ ] Order management works

### 2. Security Tests
- [ ] Admin routes are protected
- [ ] Firebase rules prevent unauthorized access
- [ ] Sensitive data is not exposed
- [ ] HTTPS redirects work

### 3. Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness verified
- [ ] Images load properly
- [ ] No console errors

## 📝 Documentation

### 1. Update Documentation
- [ ] Update README with production URLs
- [ ] Document admin procedures
- [ ] Create user manual
- [ ] Document backup procedures

### 2. Team Handover
- [ ] Share admin credentials securely
- [ ] Provide access to Firebase console
- [ ] Share Vercel dashboard access
- [ ] Document maintenance procedures

## 🎉 Go Live!

### 1. Launch Preparation
- [ ] Announce launch date
- [ ] Prepare marketing materials
- [ ] Train staff on admin panel
- [ ] Set up customer support

### 2. Post-Launch
- [ ] Monitor for issues
- [ ] Collect user feedback
- [ ] Plan future updates
- [ ] Schedule regular backups

---

## 🆘 Emergency Contacts

**Technical Issues:**
- Firebase Support: [Firebase Support](https://firebase.google.com/support)
- Vercel Support: [Vercel Support](https://vercel.com/support)

**Quick Commands:**
```bash
# Deploy everything
npm run deploy

# Deploy only Firebase rules
npm run deploy:firebase

# Deploy only to Vercel
npm run deploy:vercel

# Generate new security keys
npm run generate-keys
```

**Important URLs:**
- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- Production Site: [Your Vercel URL]
- Admin Panel: [Your Vercel URL]/admin

---

✅ **Deployment Complete!** Your cafe website is now live and ready for customers! 🎉
