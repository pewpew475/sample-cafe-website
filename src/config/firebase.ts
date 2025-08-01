// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration - Production Ready
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Validate Firebase configuration - only validate when actually running the app
// Skip validation during build/static generation to prevent deployment failures
const isBuilding = process.env.NODE_ENV === 'production' && typeof window === 'undefined';
const shouldValidate = typeof window !== 'undefined' && !isBuilding;

if (shouldValidate) {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error(
      `❌ Missing required Firebase environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please check your Vercel environment variables configuration.\n' +
      'Visit: https://vercel.com/dashboard → Your Project → Settings → Environment Variables'
    );

    // Show user-friendly error instead of crashing the app
    if (typeof window !== 'undefined') {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9); color: white; padding: 20px;
        font-family: monospace; z-index: 9999; overflow: auto;
      `;
      errorDiv.innerHTML = `
        <h2>🔧 Configuration Error</h2>
        <p>Missing Firebase environment variables in production:</p>
        <ul>${missingEnvVars.map(v => `<li>${v}</li>`).join('')}</ul>
        <p>Please set these variables in your Vercel dashboard:</p>
        <p><strong>Vercel Dashboard → Project Settings → Environment Variables</strong></p>
        <button onclick="this.parentElement.remove()" style="margin-top: 20px; padding: 10px;">Close</button>
      `;
      document.body.appendChild(errorDiv);
    }

    // Don't throw error, just return early to prevent app crash
    return;
  }
} else if (isBuilding) {
  // During build, just log info about environment status
  console.log('🔧 Firebase config loaded for build process');
}

// Initialize Firebase - handle missing config gracefully
let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;

try {
  // Check if we have a valid config
  const hasValidConfig = firebaseConfig.apiKey &&
                        firebaseConfig.projectId &&
                        firebaseConfig.apiKey !== '' &&
                        firebaseConfig.projectId !== '';

  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️ Firebase initialization skipped - missing configuration');
    // Create placeholder objects to prevent import errors
    db = null;
    auth = null;
    storage = null;
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Create placeholder objects to prevent import errors
  db = null;
  auth = null;
  storage = null;
}

export { db, auth, storage };

// Connect to emulators only in development with explicit flag
if (process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' &&
    typeof window !== 'undefined') {

  console.log('🔧 Connecting to Firebase emulators...');

  try {
    // Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Connected to Firestore emulator');
  } catch (error) {
    console.log('⚠️ Firestore emulator connection failed:', error);
  }

  try {
    // Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('✅ Connected to Auth emulator');
  } catch (error) {
    console.log('⚠️ Auth emulator connection failed:', error);
  }

  try {
    // Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Connected to Storage emulator');
  } catch (error) {
    console.log('⚠️ Storage emulator connection failed:', error);
  }
} else if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Firebase initialized for production');
}

export default app;
