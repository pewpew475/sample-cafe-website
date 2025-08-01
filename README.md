# Sample Cafe Website

A modern, responsive cafe website built with Next.js 15, TypeScript, and Firebase. Features a complete restaurant management system with order processing, product management, and admin dashboard.

## 🌟 Live Demo

🔗 **[View Live Demo](https://your-cafe-website.vercel.app)** *(Replace with your actual deployment URL)*

## 📸 Screenshots

| Home Page | Menu Page | Admin Dashboard |
|-----------|-----------|-----------------|
| ![Home](./docs/screenshots/home.png) | ![Menu](./docs/screenshots/menu.png) | ![Admin](./docs/screenshots/admin.png) |

*Screenshots coming soon - add your actual screenshots to `/docs/screenshots/` directory*

## 🚀 Features

- **Modern Design**: Beautiful, responsive UI with mobile-first approach
- **Order Management**: Complete order processing system with sequential numbering
- **Product Management**: Full CRUD operations for menu items and categories
- **Admin Dashboard**: Comprehensive admin panel for restaurant management
- **Firebase Integration**: Real-time database with automatic synchronization
- **Security**: Input validation, sanitization, and secure authentication
- **Mobile Responsive**: Optimized for all device sizes using clamp() functions
- **Contact System**: Contact form and business information pages

## 📋 Pages

- **Home**: Hero section with featured products
- **Menu**: Complete product catalog with cart functionality
- **About**: Company information, story, and team details
- **Contact**: Contact form, business hours, and location
- **Cart**: Shopping cart with order processing
- **Admin**: Restaurant management dashboard

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules with custom properties
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Image Storage**: Local file storage (development) / Vercel Blob (production)
- **State Management**: React Context API
- **Deployment**: Vercel-ready

## ⚡ Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd sample-cafe-website-1

# Install dependencies
npm install

# Set up environment variables
npm run setup

# Generate security keys
npm run generate-keys

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Detailed Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sample-cafe-website-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup
   # This copies .env.example to .env.local
   ```

   Edit `.env.local` with your Firebase configuration and other required settings.

   **📸 For image uploads**: The application uses local file storage in the `public/uploads` directory for development and Vercel Blob storage for production deployments.

4. **Generate security keys**
   ```bash
   npm run generate-keys
   ```
   This generates secure JWT and encryption keys for your application.

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

### Firebase Configuration

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Enable Storage

2. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon or "Add app"
   - Copy the configuration object

3. **Configure Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Admin collection - only authenticated users
       match /admins/{adminId} {
         allow read, write: if request.auth != null && request.auth.uid == adminId;
       }

       // Other collections - only authenticated admins
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Generate Secure Keys**
   Run the key generator to create secure JWT and encryption keys:
   ```bash
   node generate-keys.js
   ```
   Copy the generated keys to your `.env.local` file.

5. **Update Environment Variables**
   Replace the values in `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Admin Access

The application now uses **Firebase Authentication** for secure admin access:

1. **First Time Setup**:
   - Visit `/admin` on your first deployment
   - You'll see an admin setup page to create your first admin account
   - Enter your email, username, and secure password
   - The account will be created in Firebase Auth and Firestore

2. **Subsequent Logins**:
   - Use your email and password to log in
   - Credentials are securely stored and validated through Firebase

3. **Legacy Support**:
   - Environment variables are still supported for backward compatibility
   - Update these in your `.env.local` file if needed:
   ```env
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   ```

4. **Firebase Auth Features**:
   - Secure password hashing
   - Session management
   - Password reset capabilities
   - Multi-admin support

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── cart/              # Shopping cart
│   ├── contact/           # Contact page
│   ├── menu/              # Menu page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Admin/             # Admin panel components
│   ├── footer/            # Footer component
│   ├── header/            # Header component
│   ├── navigation/        # Navigation bar
│   └── products/          # Product components
├── context/               # React Context providers
├── services/              # Firebase services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── config/                # Configuration files
```

## 🔐 Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **XSS Protection**: Protection against cross-site scripting attacks
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Secure Authentication**: Firebase Auth with secure session management
- **Environment Variables**: Sensitive data stored in environment variables

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

Uses modern CSS techniques:
- CSS Grid and Flexbox for layouts
- CSS clamp() functions for fluid typography
- CSS custom properties for consistent theming
- Mobile-first responsive design approach

## 🎨 Styling

- **CSS Modules**: Component-scoped styling
- **Custom Properties**: Consistent color scheme and spacing
- **Modern CSS**: Grid, Flexbox, clamp(), and custom properties
- **Animations**: Smooth transitions and hover effects
- **Gradients**: Modern gradient backgrounds and effects

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings → Environment Variables
   - Add all environment variables from `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     NEXT_PUBLIC_APP_NAME=Your Cafe Name
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     NEXT_PUBLIC_ENABLE_ADMIN_SETUP=true
     BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
     JWT_SECRET=your_jwt_secret
     ENCRYPTION_KEY=your_encryption_key
     NODE_ENV=production
     ```
   - **Important**: Set environment for "Production", "Preview", and "Development" as needed

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set up Vercel Blob Storage (for image uploads)**
   - Go to your Vercel dashboard → Storage tab
   - Create a new Blob store or use existing one
   - Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
   - Add it to your environment variables

5. **Post-Deployment Setup**
   - Visit your deployed site's `/admin` page
   - Complete the admin setup if it's your first deployment
   - Test image uploads and Firebase connectivity

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- **Netlify**: Supports Next.js with automatic deployments
- **AWS Amplify**: Full-stack deployment with AWS integration
- **Railway**: Simple deployment with database support
- **Heroku**: Traditional PaaS deployment (requires buildpack)

**Note**: For platforms other than Vercel, you may need to configure image storage differently as Vercel Blob is Vercel-specific.

### 📋 Deployment Checklist

Before deploying, ensure you have:

- [ ] **Firebase Project** set up with Firestore and Authentication enabled
- [ ] **Environment Variables** configured in Vercel dashboard
- [ ] **Vercel Blob Storage** created and token added to environment variables
- [ ] **Security Keys** generated using `npm run generate-keys`
- [ ] **Firebase Security Rules** configured (see Firebase setup section)
- [ ] **Domain** configured (if using custom domain)

After deployment:

- [ ] **Admin Setup** completed at `/admin` page
- [ ] **Image Upload** tested and working
- [ ] **Firebase Connection** verified
- [ ] **SSL Certificate** active (automatic with Vercel)
- [ ] **Performance** tested with Lighthouse or similar tools

## 📚 API Reference

### Firebase Services

- **Product Service**: CRUD operations for menu items
- **Order Service**: Order management and tracking
- **Category Service**: Product category management
- **Settings Service**: Application settings management

### Context API

- **RestaurantContext**: Global state management for cart, orders, and products

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the Firebase setup guide

## 🔄 Firebase Integration

The application is designed to work with Firebase for data persistence and real-time updates:

- **Automatic Sync**: All admin panel changes can be configured to automatically sync with Firebase
- **Real-time Updates**: Changes are reflected across all connected clients
- **Offline Support**: Firebase provides offline data persistence
- **Scalable**: Firebase handles scaling automatically

### Firebase Services Available

- **Product Service**: Complete CRUD operations for menu items
- **Order Service**: Order management with real-time status updates
- **Category Service**: Product category management
- **Settings Service**: Application configuration management
- **Batch Service**: Bulk operations for data synchronization

### Development vs Production

- **Development**: Uses local state with optional Firebase emulator
- **Production**: Fully integrated with Firebase for data persistence

To enable automatic Firebase sync, integrate the Firebase services in your admin components and context providers.
