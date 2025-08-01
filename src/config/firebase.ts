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
    throw new Error(
      `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please check your environment configuration and ensure all Firebase variables are set.'
    );
  }
} else if (isBuilding) {
  // During build, just log info about environment status
  console.log('🔧 Firebase config loaded for build process');
}

// Initialize Firebase - handle missing config gracefully during build
let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;

try {
  // Only initialize if we have a valid config or we're in the browser
  const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

  if (hasValidConfig || typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } else {
    console.log('⚠️ Firebase initialization skipped during build - no valid config');
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization failed:', error);
  // Create mock objects for build process
  if (typeof window === 'undefined') {
    db = null;
    auth = null;
    storage = null;
  }
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
