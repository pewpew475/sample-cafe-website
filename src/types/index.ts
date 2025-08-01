// Product related types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string; // Local image URL
  imageFilename?: string; // Local filename for image management
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// Order related types
export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  items: OrderItem[];
  tableNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Cart related types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Restaurant settings types
export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxRate: number;
  serviceCharge: number;
}

// Admin user types
export interface AdminUser {
  username: string;
  password: string;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface OrderFilters {
  status?: OrderStatus;
  date?: Date;
  month?: number;
  year?: number;
  tableNumber?: string;
  orderId?: string;
}

// Form types
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: File | string; // Support both File uploads and URL strings
}

export interface OrderUpdateData {
  status: OrderStatus;
  notes?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Context types
export interface RestaurantContextType {
  // Products
  products: Product[];
  categories: Category[];
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Orders
  orders: Order[];
  nextOrderNumber: number;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getFilteredOrders: (filters: OrderFilters) => Order[];
  clearOrderHistory: () => Promise<void>;
  
  // Cart
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (tableNumber: string) => Promise<void>;
  
  // Settings
  settings: RestaurantSettings;
  updateSettings: (settings: Partial<RestaurantSettings>) => Promise<void>;
  
  // Admin
  adminUser: AdminUser;
  updateAdminCredentials: (credentials: AdminUser) => Promise<void>;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => Promise<void>;

  // Firebase Authentication
  setAuthenticated: (authenticated: boolean) => void;
  checkAuthStatus: () => boolean;
  getCurrentAdminUser: () => any;
}
