#!/bin/bash

# Sample Cafe Website Setup Script
echo "🚀 Setting up Sample Cafe Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
elif command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# Create environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Environment file created at .env.local"
else
    echo "⚠️  Environment file already exists at .env.local"
fi

# Generate secure keys
echo "🔐 Generating secure keys..."
if [ -f generate-keys.js ]; then
    node generate-keys.js
    echo "✅ Secure keys generated! Copy them to your .env.local file"
else
    echo "⚠️  generate-keys.js not found"
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI is not installed. Install it for easier Firebase management:"
    echo "npm install -g firebase-tools"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Copy the generated secure keys to your .env.local file"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000 to see your website"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🔧 Useful commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run lint     - Run linter"
echo "  npm run setup    - Copy environment file"
echo ""
