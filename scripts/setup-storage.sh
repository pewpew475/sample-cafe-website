#!/bin/bash

# 🗄️ Storage Setup Script for Cafe Website
# This script helps you set up Vercel Blob Storage and Firebase

echo "🗄️ Setting up Storage for Cafe Website..."
echo "=========================================="

# Check if required tools are installed
echo "🔍 Checking prerequisites..."

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Prerequisites check complete!"
echo ""

# Firebase Setup
echo "🔥 Firebase Setup"
echo "=================="
echo "1. Go to https://console.firebase.google.com"
echo "2. Create a new project (e.g., 'your-cafe-prod')"
echo "3. Enable Firestore Database (production mode)"
echo "4. Enable Authentication > Email/Password"
echo "5. Get your Firebase config from Project Settings"
echo ""
echo "Press Enter when you have your Firebase config ready..."
read -r

# Vercel Setup
echo "🌐 Vercel Setup"
echo "==============="
echo "1. Go to https://vercel.com and sign up"
echo "2. Create a new Blob Storage:"
echo "   - Go to Storage > Create Database > Blob"
echo "   - Name: 'cafe-images'"
echo "   - Get the Read Write Token"
echo ""
echo "Press Enter when you have your Vercel Blob token ready..."
read -r

# Environment Setup
echo "⚙️ Environment Configuration"
echo "============================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📄 Creating .env.local from template..."
    cp .env.example .env.local
fi

echo "📝 Please update your .env.local file with:"
echo ""
echo "Firebase Configuration:"
echo "- NEXT_PUBLIC_FIREBASE_API_KEY"
echo "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "- NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "- NEXT_PUBLIC_FIREBASE_APP_ID"
echo ""
echo "Vercel Blob Storage:"
echo "- BLOB_READ_WRITE_TOKEN"
echo ""

# Generate secure keys
echo "🔐 Generating secure keys..."
if [ -f "scripts/generate-keys.js" ]; then
    node scripts/generate-keys.js
    echo "✅ Secure keys generated! Copy them to your .env.local file."
else
    echo "⚠️ Key generator not found. Please set JWT_SECRET and ENCRYPTION_KEY manually."
fi

echo ""
echo "📖 Next Steps:"
echo "=============="
echo "1. Update .env.local with your Firebase and Vercel credentials"
echo "2. Test locally: npm run dev"
echo "3. Deploy Firebase rules: firebase deploy --only firestore:rules"
echo "4. Deploy to Vercel: npm run deploy"
echo ""
echo "📚 For detailed instructions, see:"
echo "- STORAGE-SETUP.md (comprehensive setup guide)"
echo "- DEPLOYMENT.md (deployment instructions)"
echo ""
echo "🎉 Setup script complete!"
