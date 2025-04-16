/**
 * Application-wide constants and configuration values
 */

// API Configuration
export const API_CONFIG = {
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
  MAPBOX_TOKEN: process.env.REACT_APP_MAPBOX_TOKEN,
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Client Routes
  CLIENT: {
    BOOK_RIDE: '/book-ride',
    BOOK_STAY: '/book-stay',
    PROFILE: '/client/profile',
    HISTORY: '/client/history',
  },
  
  // Driver Routes
  DRIVER: {
    DASHBOARD: '/driver',
    RIDES: '/driver/rides',
    PROFILE: '/driver/profile',
    EARNINGS: '/driver/earnings',
  },
  
  // Host Routes
  HOST: {
    DASHBOARD: '/host',
    PROPERTIES: '/host/properties',
    PROFILE: '/host/profile',
    EARNINGS: '/host/earnings',
  },
};

// User Roles
export const USER_ROLES = {
  CLIENT: 'client',
  DRIVER: 'driver',
  HOST: 'host',
};

// Ride Status
export const RIDE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [-0.118092, 51.509865], // London coordinates
  DEFAULT_ZOOM: 12,
  STYLES: {
    DEFAULT: 'mapbox://styles/mapbox/streets-v11',
    LIGHT: 'mapbox://styles/mapbox/light-v10',
    DARK: 'mapbox://styles/mapbox/dark-v10',
  },
};

// Vehicle Types
export const VEHICLE_TYPES = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  VAN: 'van',
};

// Property Types
export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  VILLA: 'villa',
  HOTEL: 'hotel',
};

// Amenities
export const AMENITIES = {
  WIFI: 'wifi',
  PARKING: 'parking',
  POOL: 'pool',
  GYM: 'gym',
  AC: 'ac',
  KITCHEN: 'kitchen',
  TV: 'tv',
  WASHER: 'washer',
};

// Time Intervals
export const TIME_INTERVALS = {
  LOCATION_UPDATE: 10000, // 10 seconds
  AVAILABILITY_CHECK: 60000, // 1 minute
  SESSION_TIMEOUT: 3600000, // 1 hour
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
};

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES_SHOWN: 5,
};

// Rating Configuration
export const RATING_CONFIG = {
  MIN: 1,
  MAX: 5,
  STEP: 0.5,
};

// Price Ranges
export const PRICE_RANGES = {
  RIDE: {
    BASE_FARE: 5,
    PER_KM: 2,
    PER_MINUTE: 0.5,
    CANCELLATION_FEE: 5,
  },
  STAY: {
    CLEANING_FEE: 30,
    SERVICE_FEE_PERCENTAGE: 12, // 12%
    CANCELLATION_FEE_PERCENTAGE: 10, // 10%
  },
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM D, YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'h:mm A',
  DATETIME: 'MMM D, YYYY h:mm A',
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    PATTERN: /^\+?[\d\s-()]+$/,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  RIDE_BOOKED: 'Your ride has been booked successfully.',
  STAY_BOOKED: 'Your stay has been booked successfully.',
  PROFILE_UPDATED: 'Your profile has been updated successfully.',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully.',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Theme Configuration
export const THEME = {
  COLORS: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  FONTS: {
    sans: ['Inter', 'sans-serif'],
    display: ['Poppins', 'sans-serif'],
  },
};

export default {
  API_CONFIG,
  ROUTES,
  USER_ROLES,
  RIDE_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
  MAP_CONFIG,
  VEHICLE_TYPES,
  PROPERTY_TYPES,
  AMENITIES,
  TIME_INTERVALS,
  UPLOAD_LIMITS,
  PAGINATION,
  RATING_CONFIG,
  PRICE_RANGES,
  DATE_FORMATS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  THEME,
};
