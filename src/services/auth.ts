import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  username: string;
  role: 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AdminCredentials {
  email: string;
  password: string;
  username?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private adminUser: AdminUser | null = null;

  constructor() {
    // Only listen for auth state changes if auth is available
    if (auth) {
      try {
        onAuthStateChanged(auth, async (user) => {
          this.currentUser = user;
          if (user) {
            await this.loadAdminProfile(user.uid);
          } else {
            this.adminUser = null;
          }
        });
      } catch (error) {
        console.warn('Firebase auth state listener failed:', error);
      }
    }
  }

  // Get current authenticated user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current admin user profile
  getCurrentAdminUser(): AdminUser | null {
    return this.adminUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Get Firebase ID token for API authentication
   */
  async getIdToken(): Promise<string | null> {
    if (!this.currentUser) {
      return null;
    }

    try {
      return await this.currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  // Load admin profile from Firestore
  private async loadAdminProfile(uid: string): Promise<void> {
    if (!db) {
      console.warn('Firestore not available - skipping admin profile load');
      return;
    }

    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        this.adminUser = {
          uid,
          email: data.email,
          username: data.username,
          role: data.role,
          createdAt: data.createdAt.toDate(),
          lastLogin: data.lastLogin?.toDate()
        };
      }
    } catch (error) {
      console.error('Error loading admin profile:', error);
    }
  }

  // Sign in admin user
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!auth || !db) {
      return { success: false, error: 'Firebase services not available. Please check configuration.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is an admin
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists()) {
        await signOut(auth);
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      // Update last login
      await updateDoc(doc(db, 'admins', user.uid), {
        lastLogin: new Date()
      });

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Login failed';

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }

      return { success: false, error: errorMessage };
    }
  }

  // Create admin user (for initial setup)
  async createAdmin(credentials: AdminCredentials): Promise<{ success: boolean; error?: string }> {
    if (!auth || !db) {
      return { success: false, error: 'Firebase services not available. Please check configuration.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;

      // Create admin profile in Firestore
      const adminData: Omit<AdminUser, 'uid'> = {
        email: credentials.email,
        username: credentials.username || 'admin',
        role: 'admin',
        createdAt: new Date()
      };

      await setDoc(doc(db, 'admins', user.uid), adminData);

      // Mark that admin setup is completed
      localStorage.setItem('admin_setup_completed', 'true');

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to create admin account';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message || 'Failed to create admin account';
      }

      return { success: false, error: errorMessage };
    }
  }

  // Update admin credentials
  async updateCredentials(
    currentPassword: string,
    newEmail?: string,
    newPassword?: string,
    newUsername?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!auth || !db) {
      return { success: false, error: 'Firebase services not available. Please check configuration.' };
    }

    try {
      if (!this.currentUser) {
        return { success: false, error: 'Not authenticated' };
      }

      // Re-authenticate user before making changes
      const credential = EmailAuthProvider.credential(
        this.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(this.currentUser, credential);

      // Update email if provided
      if (newEmail && newEmail !== this.currentUser.email) {
        await updateEmail(this.currentUser, newEmail);
      }

      // Update password if provided
      if (newPassword) {
        await updatePassword(this.currentUser, newPassword);
      }

      // Update username in Firestore if provided
      if (newUsername && this.adminUser) {
        await updateDoc(doc(db, 'admins', this.currentUser.uid), {
          username: newUsername,
          ...(newEmail && { email: newEmail })
        });
      }

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to update credentials';
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Current password is incorrect';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use';
          break;
        case 'auth/weak-password':
          errorMessage = 'New password is too weak';
          break;
        default:
          errorMessage = error.message || 'Failed to update credentials';
      }

      return { success: false, error: errorMessage };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    if (!auth) {
      console.warn('Firebase auth not available for sign out');
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Check if admin exists (for initial setup)
  async checkAdminExists(): Promise<boolean> {
    try {
      // First check if we've already created an admin (stored locally)
      const adminCreated = localStorage.getItem('admin_setup_completed');
      if (adminCreated === 'true') {
        return true;
      }

      // If Firebase is not available, return false to show setup
      if (!db) {
        return false;
      }

      // Try to query Firebase for any admin users
      const adminsRef = collection(db, 'admins');
      const adminSnapshot = await getDocs(adminsRef);

      if (!adminSnapshot.empty) {
        // Mark that admin setup is completed
        localStorage.setItem('admin_setup_completed', 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking admin existence:', error);
      // If Firebase fails, check local flag
      return localStorage.getItem('admin_setup_completed') === 'true';
    }
  }

  // Reset admin setup flag (for testing/development only)
  resetAdminSetup(): void {
    localStorage.removeItem('admin_setup_completed');
    console.log('Admin setup flag reset - setup form will show again on next visit');
  }


}

// Export singleton instance
export const authService = new AuthService();
export default authService;
