@echo off
echo 🚀 Setting up Sample Cafe Website...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install dependencies
echo 📦 Installing dependencies...
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    yarn install
) else (
    where pnpm >nul 2>&1
    if %errorlevel% equ 0 (
        pnpm install
    ) else (
        npm install
    )
)

REM Create environment file
if not exist .env.local (
    echo 📝 Creating environment file...
    copy .env.example .env.local
    echo ✅ Environment file created at .env.local
) else (
    echo ⚠️  Environment file already exists at .env.local
)

REM Generate secure keys
echo 🔐 Generating secure keys...
if exist generate-keys.js (
    node generate-keys.js
    echo ✅ Secure keys generated! Copy them to your .env.local file
) else (
    echo ⚠️  generate-keys.js not found
)

REM Check if Firebase CLI is installed
where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Firebase CLI is not installed. Install it for easier Firebase management:
    echo npm install -g firebase-tools
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your Firebase configuration
echo 2. Copy the generated secure keys to your .env.local file
echo 3. Run 'npm run dev' to start the development server
echo 4. Visit http://localhost:3000 to see your website
echo.
echo 📚 For more information, check the README.md file
echo.
echo 🔧 Useful commands:
echo   npm run dev      - Start development server
echo   npm run build    - Build for production
echo   npm run lint     - Run linter
echo   npm run setup    - Copy environment file
echo.
pause
