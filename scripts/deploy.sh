#!/bin/bash

# Sample Cafe Website - Production Deployment Script
echo "🚀 Deploying Sample Cafe Website to Production..."

# Check if required tools are installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if production environment file exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found. Please create it with your production configuration."
    exit 1
fi

# Generate production keys if needed
echo "🔐 Generating production security keys..."
node generate-keys.js > production-keys.txt
echo "✅ Production keys saved to production-keys.txt"
echo "⚠️  Please update your .env.production and Vercel environment variables with these keys"

# Build the application
echo "📦 Building application for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy Firebase Security Rules
echo "🔒 Deploying Firebase security rules..."
firebase deploy --only firestore:rules,storage:rules

if [ $? -ne 0 ]; then
    echo "❌ Firebase rules deployment failed."
    exit 1
fi

echo "✅ Firebase security rules deployed!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Vercel deployment failed."
    exit 1
fi

echo "✅ Vercel deployment successful!"

# Clean up
rm -f production-keys.txt

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Post-deployment checklist:"
echo "1. ✅ Application built successfully"
echo "2. ✅ Firebase security rules deployed"
echo "3. ✅ Vercel deployment completed"
echo ""
echo "🔧 Next steps:"
echo "1. Visit your Vercel dashboard to get your production URL"
echo "2. Update your Firebase authorized domains with the production URL"
echo "3. Test the admin login functionality"
echo "4. Create your first admin account if NEXT_PUBLIC_ENABLE_ADMIN_SETUP=true"
echo "5. Set NEXT_PUBLIC_ENABLE_ADMIN_SETUP=false after admin setup"
echo ""
echo "🔗 Useful links:"
echo "  Vercel Dashboard: https://vercel.com/dashboard"
echo "  Firebase Console: https://console.firebase.google.com"
echo ""
