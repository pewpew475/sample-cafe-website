// Firebase configuration and initialization
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration - Production Ready
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Check if we have valid configuration
const hasValidConfig = firebaseConfig.apiKey &&
                      firebaseConfig.projectId &&
                      firebaseConfig.apiKey !== '' &&
                      firebaseConfig.projectId !== '';

// Only show errors in browser, not during build
if (typeof window !== 'undefined' && !hasValidConfig) {
  console.error('❌ Firebase configuration missing. Please check your environment variables.');
}

// Initialize Firebase - handle missing config gracefully
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (hasValidConfig) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Only log success in development or when explicitly needed
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Firebase initialized successfully');
    }
  } else {
    // In production, don't log warnings to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Firebase initialization skipped - missing configuration');
    }
  }
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Firebase initialization failed:', error);
  }
}

export { app, db, auth, storage };

// Connect to emulators only in development with explicit flag
if (process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' &&
    typeof window !== 'undefined' &&
    db && auth && storage) {

  console.log('🔧 Connecting to Firebase emulators...');

  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Connected to Firestore emulator');
  } catch (error) {
    console.log('⚠️ Firestore emulator connection failed:', error);
  }

  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('✅ Connected to Auth emulator');
  } catch (error) {
    console.log('⚠️ Auth emulator connection failed:', error);
  }

  try {
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Connected to Storage emulator');
  } catch (error) {
    console.log('⚠️ Storage emulator connection failed:', error);
  }
}

export default app;
