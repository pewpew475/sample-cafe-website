# 🗄️ Vercel Blob Storage Setup Guide

## 🎯 Quick Fix for Image Upload Error

Your image uploads are failing because **Vercel Blob Storage** is not configured. Follow these steps to fix it:

## 📋 Step 1: Create Vercel Blob Storage

1. **Go to your Vercel Dashboard**: https://vercel.com/dashboard
2. **Navigate to Storage**: Click "Storage" in the left sidebar
3. **Create Blob Storage**:
   - Click "Create Database"
   - Select "Blob"
   - Name: `cafe-images` (or any name you prefer)
   - Region: Choose same region as your app (usually `iad1` for US East)
   - Click "Create"

## 🔑 Step 2: Get Your Blob Token

1. **In your new Blob storage**:
   - Click on your newly created blob storage
   - Go to the "Settings" tab
   - Find "Read Write Token" section
   - Click "Create Token" or "Show Token"
   - **Copy the token** (starts with `vercel_blob_rw_`)

## ⚙️ Step 3: Add Environment Variable

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" tab
   - Click "Environment Variables" in the left menu
   - Click "Add New"

2. **Add the variable**:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Paste your blob token (e.g., `vercel_blob_rw_xxxxxxxxxxxxxxxx`)
   - **Environment**: Select "Production", "Preview", and "Development"
   - Click "Save"

## 🚀 Step 4: Redeploy Your Application

1. **Trigger a new deployment**:
   - Go to "Deployments" tab in your Vercel project
   - Click "Redeploy" on the latest deployment
   - OR push a new commit to your repository

## ✅ Step 5: Test Image Upload

1. **Visit your deployed admin panel**: `https://your-site.vercel.app/admin`
2. **Login to admin**
3. **Go to Product Management**
4. **Try uploading an image** - it should now work!

## 🔍 Troubleshooting

### If you still get errors:

1. **Check the token is correct**:
   - Make sure it starts with `vercel_blob_rw_`
   - No extra spaces or characters
   - Token is set for "Production" environment

2. **Check deployment**:
   - Make sure you redeployed after adding the environment variable
   - Check deployment logs for any errors

3. **Check browser console**:
   - Open browser dev tools (F12)
   - Look for any error messages in the console

### Common Issues:

- **"Vercel Blob Storage not configured"**: Environment variable not set
- **"Upload failed with status 500"**: Token is invalid or missing
- **"Unauthorized"**: Admin authentication issue (separate from blob storage)

## 📝 What Changed

I've updated your application to use **Vercel Blob Storage** instead of local file storage:

- ✅ **Upload API** now uses `@vercel/blob` package
- ✅ **Images stored** in Vercel's global CDN
- ✅ **Better performance** with automatic optimization
- ✅ **Scalable solution** that works on serverless platforms

## 💡 Benefits of Vercel Blob Storage

- **🌍 Global CDN**: Images served from edge locations worldwide
- **⚡ Fast uploads**: Optimized for speed and reliability  
- **🔄 Auto-optimization**: WebP/AVIF conversion, resizing
- **💰 Cost-effective**: Pay only for what you use
- **🔒 Secure**: Built-in security and access controls

Your image uploads should work perfectly after following these steps! 🎉
