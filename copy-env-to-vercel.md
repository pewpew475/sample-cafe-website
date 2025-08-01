# Copy Environment Variables to Vercel

## 🚨 **URGENT: Set These Environment Variables in Vercel**

Your app is deployed but missing environment variables. Here are the exact values from your `.env.production` file that need to be set in Vercel:

### 🔧 **How to Set Environment Variables in Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Navigate to your project: **sample-cafe-website**
3. Go to **Settings** → **Environment Variables**
4. Add each variable below with the exact values shown

### 📋 **Required Environment Variables:**

**Firebase Configuration:**
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBUzV9cj6lxAy7CayVfo3-MQk5_ZJoNRx0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = sample-cafe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = sample-cafe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = sample-cafe-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 946719851074
NEXT_PUBLIC_FIREBASE_APP_ID = 1:946719851074:web:94420bf73039a4fd2423db
```

**Application Settings:**
```
NEXT_PUBLIC_APP_NAME = "sample-cafe-website"
NEXT_PUBLIC_APP_URL = https://sample-cafe-website-five.vercel.app
NEXT_PUBLIC_ENABLE_ADMIN_SETUP = false
NODE_ENV = production
```

**Security Settings:**
```
JWT_SECRET = ICdUbl2BBlU3McOr2JtAdm7h3rPc0VVVS8tqL5n0I5L7gNjBZX4UXTz/JjeftfFJ6blFez0RkejCI+OPeDX9Uw==
ENCRYPTION_KEY = 5277dc9cc0d76b486d5499ce72a95002b06c341d86b1f4502f74133f011b098c
```

**Optional Business Information:**
```
NEXT_PUBLIC_PHONE = +1-555-YOUR-CAFE
NEXT_PUBLIC_EMAIL = info@yourcafe.com
NEXT_PUBLIC_ADDRESS = "Your Cafe Address"
NEXT_PUBLIC_HOURS_WEEKDAY = "7:00 AM - 9:00 PM"
NEXT_PUBLIC_HOURS_WEEKEND = "8:00 AM - 10:00 PM"
NEXT_PUBLIC_FACEBOOK_URL = https://facebook.com/your_page
NEXT_PUBLIC_INSTAGRAM_URL = https://instagram.com/your_account
NEXT_PUBLIC_TWITTER_URL = https://twitter.com/your_account
```

### 🚀 **Quick CLI Method (Alternative):**

If you prefer using the command line:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Set each variable (copy-paste the values from above)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add NEXT_PUBLIC_APP_NAME production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_ENABLE_ADMIN_SETUP production
vercel env add NODE_ENV production
vercel env add JWT_SECRET production
vercel env add ENCRYPTION_KEY production

# Optional variables
vercel env add NEXT_PUBLIC_PHONE production
vercel env add NEXT_PUBLIC_EMAIL production
vercel env add NEXT_PUBLIC_ADDRESS production
vercel env add NEXT_PUBLIC_HOURS_WEEKDAY production
vercel env add NEXT_PUBLIC_HOURS_WEEKEND production
vercel env add NEXT_PUBLIC_FACEBOOK_URL production
vercel env add NEXT_PUBLIC_INSTAGRAM_URL production
vercel env add NEXT_PUBLIC_TWITTER_URL production
```

### ✅ **After Setting Variables:**

1. **Redeploy your app** (Vercel will automatically redeploy when you change environment variables)
2. **Wait for deployment to complete**
3. **Visit your site**: https://sample-cafe-website-five.vercel.app
4. **Check that Firebase errors are gone**

### 🔍 **Verify Environment Variables:**

To check if variables are set correctly:
```bash
vercel env ls
```

### 📞 **Need Help?**

If you're still seeing errors after setting the variables:
1. Check that all variable names are exactly correct (case-sensitive)
2. Make sure values don't have extra spaces or quotes
3. Verify the environment is set to "Production"
4. Try redeploying: `vercel --prod`
