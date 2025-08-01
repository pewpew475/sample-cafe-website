// Security utilities for input validation and sanitization

// Input validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  tableNumber: /^[a-zA-Z0-9]{1,10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  price: /^\d+(\.\d{1,2})?$/,
  quantity: /^[1-9]\d*$/
};

// Input sanitization functions
export const sanitizeInput = {
  // Remove HTML tags and dangerous characters
  text: (input: string): string => {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  },

  // Sanitize email
  email: (input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .substring(0, 254); // RFC 5321 limit
  },

  // Sanitize phone number
  phone: (input: string): string => {
    return input
      .replace(/[^\d\+\-\(\)\s]/g, '') // Keep only digits, +, -, (, ), space
      .trim()
      .substring(0, 20);
  },

  // Sanitize numeric input
  number: (input: string | number): number => {
    const num = typeof input === 'string' ? parseFloat(input) : input;
    return isNaN(num) ? 0 : Math.max(0, num);
  },

  // Sanitize table number
  tableNumber: (input: string): string => {
    return input
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 10);
  }
};

// Validation functions
export const validate = {
  email: (email: string): boolean => {
    return ValidationPatterns.email.test(email) && email.length <= 254;
  },

  phone: (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return ValidationPatterns.phone.test(cleaned) && cleaned.length >= 10;
  },

  name: (name: string): boolean => {
    return ValidationPatterns.name.test(name) && name.length >= 2 && name.length <= 50;
  },

  tableNumber: (tableNumber: string): boolean => {
    return ValidationPatterns.tableNumber.test(tableNumber) && tableNumber.length >= 1;
  },

  password: (password: string): boolean => {
    return ValidationPatterns.password.test(password);
  },

  username: (username: string): boolean => {
    return ValidationPatterns.username.test(username);
  },

  price: (price: string | number): boolean => {
    const priceStr = typeof price === 'number' ? price.toString() : price;
    return ValidationPatterns.price.test(priceStr) && parseFloat(priceStr) >= 0;
  },

  quantity: (quantity: string | number): boolean => {
    const qtyStr = typeof quantity === 'number' ? quantity.toString() : quantity;
    return ValidationPatterns.quantity.test(qtyStr) && parseInt(qtyStr) > 0 && parseInt(qtyStr) <= 100;
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }
};

// Form validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateForm = {
  contact: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): ValidationResult => {
    const errors: string[] = [];

    if (!validate.required(data.name)) {
      errors.push('Name is required');
    } else if (!validate.name(data.name)) {
      errors.push('Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes');
    }

    if (!validate.required(data.email)) {
      errors.push('Email is required');
    } else if (!validate.email(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (data.phone && !validate.phone(data.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (!validate.required(data.subject)) {
      errors.push('Subject is required');
    }

    if (!validate.required(data.message)) {
      errors.push('Message is required');
    } else if (data.message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  order: (data: {
    tableNumber: string;
    items: any[];
  }): ValidationResult => {
    const errors: string[] = [];

    if (!validate.required(data.tableNumber)) {
      errors.push('Table number is required');
    } else if (!validate.tableNumber(data.tableNumber)) {
      errors.push('Please enter a valid table number');
    }

    if (!data.items || data.items.length === 0) {
      errors.push('Cart cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  product: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
  }): ValidationResult => {
    const errors: string[] = [];

    if (!validate.required(data.name)) {
      errors.push('Product name is required');
    } else if (data.name.length < 2 || data.name.length > 100) {
      errors.push('Product name must be 2-100 characters long');
    }

    if (!validate.required(data.description)) {
      errors.push('Product description is required');
    } else if (data.description.length < 10 || data.description.length > 500) {
      errors.push('Product description must be 10-500 characters long');
    }

    if (!validate.price(data.price)) {
      errors.push('Please enter a valid price');
    }

    if (!validate.required(data.category)) {
      errors.push('Product category is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  login: (data: {
    username: string;
    password: string;
  }): ValidationResult => {
    const errors: string[] = [];

    if (!validate.required(data.username)) {
      errors.push('Username is required');
    } else if (!validate.username(data.username)) {
      errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }

    if (!validate.required(data.password)) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Rate limiting (simple in-memory implementation)
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Password hashing (simple implementation - in production use bcrypt)
export const hashPassword = (password: string): string => {
  // This is a simple hash for demo purposes
  // In production, use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Session management
export const sessionManager = {
  setSession: (token: string, expiresIn: number = 24 * 60 * 60 * 1000): void => {
    if (typeof window !== 'undefined') {
      const expiry = Date.now() + expiresIn;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authExpiry', expiry.toString());
    }
  },

  getSession: (): string | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const expiry = localStorage.getItem('authExpiry');
      
      if (!token || !expiry) return null;
      
      if (Date.now() > parseInt(expiry)) {
        sessionManager.clearSession();
        return null;
      }
      
      return token;
    }
    return null;
  },

  clearSession: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authExpiry');
    }
  },

  isSessionValid: (): boolean => {
    return sessionManager.getSession() !== null;
  }
};
