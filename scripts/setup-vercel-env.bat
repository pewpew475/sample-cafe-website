@echo off
echo 🚀 Setting up Vercel Environment Variables for Sample Cafe Website
echo ==================================================================

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found. Please create it first.
    pause
    exit /b 1
)

echo 📋 Please set up your environment variables manually in Vercel Dashboard
echo or use the following commands one by one:
echo.

echo 🔧 Required Firebase Environment Variables:
echo vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo.

echo 🔧 Required Application Variables:
echo vercel env add NEXT_PUBLIC_APP_NAME production
echo vercel env add NEXT_PUBLIC_APP_URL production
echo vercel env add NODE_ENV production
echo vercel env add NEXT_PUBLIC_ENABLE_ADMIN_SETUP production
echo.

echo 🔐 Required Security Variables:
echo vercel env add JWT_SECRET production
echo vercel env add ENCRYPTION_KEY production
echo.

echo 📞 Optional Business Information:
echo vercel env add NEXT_PUBLIC_PHONE production
echo vercel env add NEXT_PUBLIC_EMAIL production
echo vercel env add NEXT_PUBLIC_ADDRESS production
echo vercel env add NEXT_PUBLIC_HOURS_WEEKDAY production
echo vercel env add NEXT_PUBLIC_HOURS_WEEKEND production
echo.

echo 📱 Optional Social Media:
echo vercel env add NEXT_PUBLIC_FACEBOOK_URL production
echo vercel env add NEXT_PUBLIC_INSTAGRAM_URL production
echo vercel env add NEXT_PUBLIC_TWITTER_URL production
echo.

echo 🔑 Optional Admin Credentials:
echo vercel env add ADMIN_USERNAME production
echo vercel env add ADMIN_PASSWORD production
echo.

echo ✅ Copy the values from your .env.local file when prompted
echo.
echo 🚀 After setting variables, deploy with: vercel --prod
echo.
echo 📋 To view all environment variables: vercel env ls
echo.

pause
