/**
 * Form-related type definitions
 */

import type { ChangeEvent, FormEvent } from 'react';

export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  value: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: T) => string | null;
  };
  error?: string;
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T = FormData> {
  data: T;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormHandlers<T = FormData> {
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  resetForm: () => void;
  validateForm: () => boolean;
}

export interface UseFormOptions<T = FormData> {
  initialValues: T;
  validationSchema?: Record<keyof T, FormField['validation']>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface AlertFormData {
  title: string;
  severity: string;
  source: string;
  description: string;
}

export interface InvestigationFormData {
  alertId: string;
  assignedTo: string;
  priority: string;
  notes: string;
}

export interface HuntQueryFormData {
  query: string;
  description: string;
  saveQuery: boolean;
}