#!/bin/bash

# Firebase Setup Script for Sample Cafe Website
echo "🔥 Setting up Firebase for Sample Cafe Website..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

# Initialize Firebase project
echo "🚀 Initializing Firebase project..."
firebase init

echo ""
echo "📋 Firebase Setup Instructions:"
echo ""
echo "When prompted, select the following options:"
echo ""
echo "1. ✅ Which Firebase features do you want to set up?"
echo "   [x] Firestore: Configure security rules and indexes files"
echo "   [x] Storage: Configure a security rules file for Cloud Storage"
echo "   [x] Hosting: Configure files for Firebase Hosting"
echo ""
echo "2. 🎯 Project Setup:"
echo "   - Select 'Use an existing project' if you have one"
echo "   - Or select 'Create a new project' and follow the prompts"
echo ""
echo "3. 📄 Firestore Setup:"
echo "   - Use existing firestore.rules file: YES"
echo "   - Use existing firestore.indexes.json file: YES"
echo ""
echo "4. 💾 Storage Setup:"
echo "   - Use existing storage.rules file: YES"
echo ""
echo "5. 🌐 Hosting Setup:"
echo "   - Public directory: out"
echo "   - Single-page app: YES"
echo "   - Set up automatic builds: NO (we'll use Vercel)"
echo ""
echo "After initialization:"
echo ""
echo "🔒 Deploy security rules:"
echo "   firebase deploy --only firestore:rules,storage:rules"
echo ""
echo "📊 Create initial data structure:"
echo "   firebase firestore:delete --all-collections"
echo "   # Then visit your website to create initial admin account"
echo ""
echo "🎉 Your Firebase project will be ready for production!"
echo ""
