// Firebase service functions for CRUD operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Order, Category, RestaurantSettings } from '../types';

// Collections
const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  ORDER_COUNTER: 'counters'
};

// Product operations
export const productService = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get product by ID
  getById: async (id: string): Promise<Product | null> => {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Add new product
  add: async (product: Omit<Product, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id: string, updates: Partial<Product>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Order operations
export const orderService = {
  // Get all orders
  getAll: async (): Promise<Order[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get orders by status
  getByStatus: async (status: string): Promise<Order[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  },

  // Add new order
  add: async (order: Omit<Order, 'id'>): Promise<string> => {
    try {
      // Get next order number
      const orderNumber = await getNextOrderNumber();
      
      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
        ...order,
        orderNumber,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Update order
  update: async (id: string, updates: Partial<Order>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete order
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};

// Category operations
export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Add new category
  add: async (category: Omit<Category, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
        ...category,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

// Settings operations
export const settingsService = {
  // Get settings
  get: async (): Promise<RestaurantSettings | null> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.SETTINGS));
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { ...doc.data() } as RestaurantSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  // Update settings
  update: async (settings: RestaurantSettings): Promise<void> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.SETTINGS));
      
      if (!querySnapshot.empty) {
        // Update existing settings
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...settings });
      } else {
        // Create new settings document
        await addDoc(collection(db, COLLECTIONS.SETTINGS), { ...settings });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

// Order number counter
const getNextOrderNumber = async (): Promise<number> => {
  try {
    const counterRef = doc(db, COLLECTIONS.ORDER_COUNTER, 'orderNumber');
    const counterDoc = await getDoc(counterRef);
    
    if (counterDoc.exists()) {
      const currentNumber = counterDoc.data().value || 0;
      const nextNumber = currentNumber + 1;
      
      // Update counter
      await updateDoc(counterRef, { value: nextNumber });
      return nextNumber;
    } else {
      // Initialize counter
      await updateDoc(counterRef, { value: 1 });
      return 1;
    }
  } catch (error) {
    console.error('Error getting next order number:', error);
    // Fallback to timestamp-based number
    return Date.now() % 100000;
  }
};

// Batch operations
export const batchService = {
  // Sync local data to Firebase
  syncToFirebase: async (data: {
    products: Product[];
    orders: Order[];
    categories: Category[];
    settings: RestaurantSettings;
  }): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // Clear existing data and add new data
      // Note: In production, you might want to be more selective about what to sync

      // Add products
      data.products.forEach(product => {
        const productRef = doc(collection(db, COLLECTIONS.PRODUCTS));
        batch.set(productRef, {
          ...product,
          createdAt: Timestamp.fromDate(product.createdAt),
          updatedAt: Timestamp.fromDate(product.updatedAt)
        });
      });

      // Add orders
      data.orders.forEach(order => {
        const orderRef = doc(collection(db, COLLECTIONS.ORDERS));
        batch.set(orderRef, {
          ...order,
          createdAt: Timestamp.fromDate(order.createdAt),
          updatedAt: Timestamp.fromDate(order.updatedAt)
        });
      });

      // Add categories
      data.categories.forEach(category => {
        const categoryRef = doc(collection(db, COLLECTIONS.CATEGORIES));
        batch.set(categoryRef, {
          ...category,
          createdAt: Timestamp.fromDate(category.createdAt)
        });
      });

      await batch.commit();
      console.log('Data synced to Firebase successfully');
    } catch (error) {
      console.error('Error syncing data to Firebase:', error);
      throw error;
    }
  }
};
