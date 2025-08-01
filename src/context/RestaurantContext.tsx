'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  Order,
  Cart,
  CartItem,
  RestaurantSettings,
  AdminUser,
  ProductFormData,
  OrderStatus,
  OrderFilters,
  RestaurantContextType
} from '../types';
import authService from '../services/auth';

// Initial state
const initialState = {
  products: [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
      price: 12.99,
      category: 'Burgers',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Chicken Caesar Salad',
      description: 'Fresh romaine lettuce with grilled chicken, parmesan, and caesar dressing',
      price: 10.99,
      category: 'Salads',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'French Fries',
      description: 'Crispy golden fries seasoned with sea salt',
      price: 4.99,
      category: 'Sides',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with chocolate frosting',
      price: 6.99,
      category: 'Desserts',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Coffee',
      description: 'Freshly brewed coffee',
      price: 2.99,
      category: 'Drinks',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as Product[],
  categories: [
    { id: '1', name: 'All Items', createdAt: new Date() },
    { id: '2', name: 'Burgers', createdAt: new Date() },
    { id: '3', name: 'Sides', createdAt: new Date() },
    { id: '4', name: 'Desserts', createdAt: new Date() },
    { id: '5', name: 'Drinks', createdAt: new Date() }
  ] as Category[],
  orders: [] as Order[],
  cart: { items: [], total: 0 } as Cart,
  settings: {
    name: 'Sample Cafe',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@samplecafe.com',
    currency: 'USD',
    taxRate: 0.08,
    serviceCharge: 0.05
  } as RestaurantSettings,
  adminUser: {
    username: 'admin',
    password: 'admin123'
  } as AdminUser,
  isAuthenticated: false,
  nextOrderNumber: 1
};

// Action types
type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; product: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<RestaurantSettings> }
  | { type: 'UPDATE_ADMIN_CREDENTIALS'; payload: AdminUser }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'INCREMENT_ORDER_NUMBER' }
  | { type: 'CLEAR_ORDER_HISTORY' }
  | { type: 'LOAD_STATE'; payload: any };

// Reducer
function restaurantReducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.product, updatedAt: new Date() }
            : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        )
      };
    
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.items.findIndex(
        item => item.productId === action.payload.product.id
      );
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [
          ...state.cart.items,
          {
            productId: action.payload.product.id,
            product: action.payload.product,
            quantity: action.payload.quantity
          }
        ];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { ...state, cart: { items: newItems, total } };
    
    case 'UPDATE_CART_ITEM':
      const updatedItems = state.cart.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { ...state, cart: { items: updatedItems, total: updatedTotal } };
    
    case 'REMOVE_FROM_CART':
      const filteredItems = state.cart.items.filter(item => item.productId !== action.payload);
      const filteredTotal = filteredItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { ...state, cart: { items: filteredItems, total: filteredTotal } };
    
    case 'CLEAR_CART':
      return { ...state, cart: { items: [], total: 0 } };
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    case 'UPDATE_ADMIN_CREDENTIALS':
      return { ...state, adminUser: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };

    case 'INCREMENT_ORDER_NUMBER':
      return { ...state, nextOrderNumber: state.nextOrderNumber + 1 };

    case 'CLEAR_ORDER_HISTORY':
      return { ...state, orders: [], nextOrderNumber: 1 };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Create context
const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Provider component
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('restaurantState');
      if (savedState && savedState.trim()) {
        try {
          const parsedState = JSON.parse(savedState);
          // Convert date strings back to Date objects
          if (parsedState.products) {
            parsedState.products = parsedState.products.map((product: any) => ({
              ...product,
              createdAt: new Date(product.createdAt),
              updatedAt: new Date(product.updatedAt)
            }));
          }
          if (parsedState.orders) {
            parsedState.orders = parsedState.orders.map((order: any) => ({
              ...order,
              createdAt: new Date(order.createdAt),
              updatedAt: new Date(order.updatedAt)
            }));
          }
          if (parsedState.categories) {
            parsedState.categories = parsedState.categories.map((category: any) => ({
              ...category,
              createdAt: new Date(category.createdAt)
            }));
          }
          dispatch({ type: 'LOAD_STATE', payload: parsedState });
        } catch (error) {
          console.error('Error loading saved state:', error);
          // Clear corrupted localStorage data
          localStorage.removeItem('restaurantState');
        }
      }
    }
  }, []);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('restaurantState', JSON.stringify(state));
    }
  }, [state]);

  // Utility function to generate unique IDs
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Context value
  const contextValue: RestaurantContextType = {
    // Products
    products: state.products,
    categories: state.categories,
    
    addProduct: async (productData: ProductFormData) => {
      let imageUrl = '';
      let imageFilename = '';

      // Generate product ID first
      const productId = generateId();

      // Upload image to local storage if provided (and it's a File, not a URL)
      if (productData.image && productData.image instanceof File) {
        try {
          const uploadResult = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer admin-token', // Simple auth for demo
            },
            body: (() => {
              const formData = new FormData();
              formData.append('file', productData.image);
              formData.append('type', 'product');
              formData.append('id', productId);
              formData.append('name', productData.name);
              return formData;
            })()
          });

          if (uploadResult.ok) {
            const result = await uploadResult.json();
            imageUrl = result.data.url;
            imageFilename = result.data.filename;
          } else {
            const errorResult = await uploadResult.json();
            console.error('Upload failed:', errorResult);
            throw new Error(`Upload failed: ${errorResult.error || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
      }

      const newProduct: Product = {
        id: productId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image: imageUrl || (typeof productData.image === 'string' ? productData.image : ''),
        imageFilename: imageFilename,
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    },
    
    updateProduct: async (id: string, product: Partial<Product>) => {
      dispatch({ type: 'UPDATE_PRODUCT', payload: { id, product } });
    },
    
    deleteProduct: async (id: string) => {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    },
    
    addCategory: async (category: Omit<Category, 'id' | 'createdAt'>) => {
      const newCategory: Category = {
        id: generateId(),
        ...category,
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    },
    
    deleteCategory: async (id: string) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    },
    
    // Orders
    orders: state.orders,
    nextOrderNumber: state.nextOrderNumber,

    updateOrderStatus: async (orderId: string, status: OrderStatus) => {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    },
    
    getFilteredOrders: (filters: OrderFilters) => {
      return state.orders.filter(order => {
        if (filters.status && order.status !== filters.status) return false;
        if (filters.tableNumber && !order.tableNumber.includes(filters.tableNumber)) return false;
        if (filters.orderId && !order.id.includes(filters.orderId)) return false;
        if (filters.date) {
          const orderDate = new Date(order.createdAt);
          const filterDate = new Date(filters.date);
          if (orderDate.toDateString() !== filterDate.toDateString()) return false;
        }
        if (filters.month !== undefined && filters.year !== undefined) {
          const orderDate = new Date(order.createdAt);
          if (orderDate.getMonth() !== filters.month || orderDate.getFullYear() !== filters.year) return false;
        }
        return true;
      });
    },
    
    // Cart
    cart: state.cart,
    
    addToCart: (product: Product, quantity: number) => {
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    },
    
    updateCartItem: (productId: string, quantity: number) => {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } });
    },
    
    removeFromCart: (productId: string) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    },
    
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    
    createOrder: async (tableNumber: string) => {
      const newOrder: Order = {
        id: generateId(),
        orderNumber: state.nextOrderNumber,
        items: state.cart.items.map(item => ({
          productId: item.productId,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price
        })),
        tableNumber,
        status: OrderStatus.PENDING,
        total: state.cart.total,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'INCREMENT_ORDER_NUMBER' });
      dispatch({ type: 'CLEAR_CART' });
    },
    
    // Settings
    settings: state.settings,
    
    updateSettings: async (settings: Partial<RestaurantSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    },
    
    // Admin
    adminUser: state.adminUser,
    isAuthenticated: state.isAuthenticated,
    
    updateAdminCredentials: async (credentials: AdminUser) => {
      dispatch({ type: 'UPDATE_ADMIN_CREDENTIALS', payload: credentials });
    },
    
    login: (username: string, password: string) => {
      // Legacy method - kept for backward compatibility
      // Firebase authentication is now handled in LoginForm component
      if (username === state.adminUser.username && password === state.adminUser.password) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        return true;
      }
      return false;
    },

    logout: async () => {
      try {
        await authService.signOut();
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      } catch (error) {
        console.error('Error signing out:', error);
        // Still set local state to false even if Firebase signout fails
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      }
    },

    clearOrderHistory: async () => {
      dispatch({ type: 'CLEAR_ORDER_HISTORY' });
    },

    // New Firebase authentication methods
    setAuthenticated: (authenticated: boolean) => {
      dispatch({ type: 'SET_AUTHENTICATED', payload: authenticated });
    },

    // Check Firebase authentication status
    checkAuthStatus: () => {
      return authService.isAuthenticated();
    },

    // Get current Firebase admin user
    getCurrentAdminUser: () => {
      return authService.getCurrentAdminUser();
    }
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Custom hook to use the context
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
