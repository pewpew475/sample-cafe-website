#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up all required environment variables in Vercel

echo "🚀 Setting up Vercel Environment Variables for Sample Cafe Website"
echo "=================================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please create it first."
    exit 1
fi

echo "📋 Reading environment variables from .env.local..."

# Source the .env.local file
set -a
source .env.local
set +a

echo "🔧 Setting up required Firebase environment variables..."

# Required Firebase variables
echo "Setting NEXT_PUBLIC_FIREBASE_API_KEY..."
echo "$NEXT_PUBLIC_FIREBASE_API_KEY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production

echo "Setting NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..."
echo "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production

echo "Setting NEXT_PUBLIC_FIREBASE_PROJECT_ID..."
echo "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production

echo "Setting NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..."
echo "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production

echo "Setting NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..."
echo "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production

echo "Setting NEXT_PUBLIC_FIREBASE_APP_ID..."
echo "$NEXT_PUBLIC_FIREBASE_APP_ID" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

echo "🔧 Setting up application variables..."

# Application variables
echo "Setting NEXT_PUBLIC_APP_NAME..."
echo "$NEXT_PUBLIC_APP_NAME" | vercel env add NEXT_PUBLIC_APP_NAME production

echo "Setting NEXT_PUBLIC_APP_URL..."
echo "https://your-vercel-domain.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

echo "Setting NODE_ENV..."
echo "production" | vercel env add NODE_ENV production

echo "Setting NEXT_PUBLIC_ENABLE_ADMIN_SETUP..."
echo "$NEXT_PUBLIC_ENABLE_ADMIN_SETUP" | vercel env add NEXT_PUBLIC_ENABLE_ADMIN_SETUP production

echo "🔐 Setting up security variables..."

# Security variables
echo "Setting JWT_SECRET..."
echo "$JWT_SECRET" | vercel env add JWT_SECRET production

echo "Setting ENCRYPTION_KEY..."
echo "$ENCRYPTION_KEY" | vercel env add ENCRYPTION_KEY production

echo "📞 Setting up optional business information..."

# Optional business variables
if [ ! -z "$NEXT_PUBLIC_PHONE" ]; then
    echo "Setting NEXT_PUBLIC_PHONE..."
    echo "$NEXT_PUBLIC_PHONE" | vercel env add NEXT_PUBLIC_PHONE production
fi

if [ ! -z "$NEXT_PUBLIC_EMAIL" ]; then
    echo "Setting NEXT_PUBLIC_EMAIL..."
    echo "$NEXT_PUBLIC_EMAIL" | vercel env add NEXT_PUBLIC_EMAIL production
fi

if [ ! -z "$NEXT_PUBLIC_ADDRESS" ]; then
    echo "Setting NEXT_PUBLIC_ADDRESS..."
    echo "$NEXT_PUBLIC_ADDRESS" | vercel env add NEXT_PUBLIC_ADDRESS production
fi

if [ ! -z "$NEXT_PUBLIC_HOURS_WEEKDAY" ]; then
    echo "Setting NEXT_PUBLIC_HOURS_WEEKDAY..."
    echo "$NEXT_PUBLIC_HOURS_WEEKDAY" | vercel env add NEXT_PUBLIC_HOURS_WEEKDAY production
fi

if [ ! -z "$NEXT_PUBLIC_HOURS_WEEKEND" ]; then
    echo "Setting NEXT_PUBLIC_HOURS_WEEKEND..."
    echo "$NEXT_PUBLIC_HOURS_WEEKEND" | vercel env add NEXT_PUBLIC_HOURS_WEEKEND production
fi

echo "📱 Setting up optional social media links..."

# Optional social media variables
if [ ! -z "$NEXT_PUBLIC_FACEBOOK_URL" ]; then
    echo "Setting NEXT_PUBLIC_FACEBOOK_URL..."
    echo "$NEXT_PUBLIC_FACEBOOK_URL" | vercel env add NEXT_PUBLIC_FACEBOOK_URL production
fi

if [ ! -z "$NEXT_PUBLIC_INSTAGRAM_URL" ]; then
    echo "Setting NEXT_PUBLIC_INSTAGRAM_URL..."
    echo "$NEXT_PUBLIC_INSTAGRAM_URL" | vercel env add NEXT_PUBLIC_INSTAGRAM_URL production
fi

if [ ! -z "$NEXT_PUBLIC_TWITTER_URL" ]; then
    echo "Setting NEXT_PUBLIC_TWITTER_URL..."
    echo "$NEXT_PUBLIC_TWITTER_URL" | vercel env add NEXT_PUBLIC_TWITTER_URL production
fi

echo "🔑 Setting up optional admin credentials..."

# Optional admin variables
if [ ! -z "$ADMIN_USERNAME" ]; then
    echo "Setting ADMIN_USERNAME..."
    echo "$ADMIN_USERNAME" | vercel env add ADMIN_USERNAME production
fi

if [ ! -z "$ADMIN_PASSWORD" ]; then
    echo "Setting ADMIN_PASSWORD..."
    echo "$ADMIN_PASSWORD" | vercel env add ADMIN_PASSWORD production
fi

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Update NEXT_PUBLIC_APP_URL with your actual Vercel domain"
echo "2. Deploy your application: vercel --prod"
echo "3. Update Firebase authorized domains to include your Vercel domain"
echo "4. Test your deployment at https://your-domain.vercel.app"
echo ""
echo "📋 To view all environment variables:"
echo "vercel env ls"
echo ""
echo "🔧 To update a specific variable:"
echo "vercel env add VARIABLE_NAME production"
