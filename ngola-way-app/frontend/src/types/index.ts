import { ReactNode } from 'react';

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string | undefined;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export interface CardProps {
  className?: string;
  children: ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

// Map Types
export interface MapConfig {
  center: [number, number];
  zoom: number;
  style: string;
}

export interface MapMarker {
  id: string;
  coordinates: [number, number];
  title: string;
  description?: string;
  type: 'pickup' | 'delivery' | 'driver';
}

export interface MapContextType {
  markers: MapMarker[];
  addMarker: (marker: Omit<MapMarker, 'id'>) => void;
  removeMarker: (id: string) => void;
  updateMarker: (id: string, data: Partial<MapMarker>) => void;
  center: [number, number];
  setCenter: (center: [number, number]) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money';
  last4?: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}

export interface PaymentContextType {
  methods: PaymentMethod[];
  addMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removeMethod: (id: string) => Promise<void>;
  setDefaultMethod: (id: string) => Promise<void>;
  processPayment: (amount: number, methodId: string) => Promise<void>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  errors?: Record<string, string[]>;
}
