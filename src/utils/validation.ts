// Validation utilities for form inputs and data processing

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (email.length > 254) {
    return { isValid: false, error: "Email address is too long" };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long" };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password is too long" };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name?.trim()) {
    return { isValid: false, error: "Name is required" };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: "Name cannot exceed 50 characters" };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\u0080-\u024F\u1E00-\u1EFF\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  return { isValid: true };
};

// Student ID validation
export const validateStudentId = (studentId: string): ValidationResult => {
  if (!studentId?.trim()) {
    return { isValid: false, error: "Student ID is required" };
  }

  const trimmedId = studentId.trim();
  
  // Assuming student IDs are numeric
  const studentIdRegex = /^\d+$/;
  if (!studentIdRegex.test(trimmedId)) {
    return { isValid: false, error: "Student ID must contain only numbers" };
  }

  if (trimmedId.length < 3 || trimmedId.length > 20) {
    return { isValid: false, error: "Student ID must be between 3 and 20 digits" };
  }

  return { isValid: true };
};

// Course name validation
export const validateCourseName = (courseName: string): ValidationResult => {
  if (!courseName?.trim()) {
    return { isValid: false, error: "Course name is required" };
  }

  const trimmedName = courseName.trim();
  
  if (trimmedName.length < 3) {
    return { isValid: false, error: "Course name must be at least 3 characters long" };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: "Course name cannot exceed 100 characters" };
  }

  return { isValid: true };
};

// Section validation
export const validateSection = (section: string): ValidationResult => {
  if (!section?.trim()) {
    return { isValid: false, error: "Section is required" };
  }

  const trimmedSection = section.trim();
  
  if (trimmedSection.length < 1) {
    return { isValid: false, error: "Section cannot be empty" };
  }

  if (trimmedSection.length > 10) {
    return { isValid: false, error: "Section cannot exceed 10 characters" };
  }

  // Allow alphanumeric characters and common section identifiers
  const sectionRegex = /^[a-zA-Z0-9\-_]+$/;
  if (!sectionRegex.test(trimmedSection)) {
    return { isValid: false, error: "Section can only contain letters, numbers, hyphens, and underscores" };
  }

  return { isValid: true };
};

// Academic data validation
export const validateGradePoints = (gradePoints: number): ValidationResult => {
  if (gradePoints == null || isNaN(gradePoints)) {
    return { isValid: false, error: "Grade points must be a valid number" };
  }

  if (gradePoints < 0) {
    return { isValid: false, error: "Grade points cannot be negative" };
  }

  if (gradePoints > 1000000) {
    return { isValid: false, error: "Grade points value is too large" };
  }

  return { isValid: true };
};

export const validateCredits = (credits: number): ValidationResult => {
  if (credits == null || isNaN(credits)) {
    return { isValid: false, error: "Credits must be a valid number" };
  }

  if (credits < 0) {
    return { isValid: false, error: "Credits cannot be negative" };
  }

  if (credits > 1000) {
    return { isValid: false, error: "Credits value is too large" };
  }

  return { isValid: true };
};

export const validateCurrentSubjects = (subjects: number): ValidationResult => {
  if (subjects == null || isNaN(subjects)) {
    return { isValid: false, error: "Number of subjects must be a valid number" };
  }

  if (subjects < 0) {
    return { isValid: false, error: "Number of subjects cannot be negative" };
  }

  if (!Number.isInteger(subjects)) {
    return { isValid: false, error: "Number of subjects must be a whole number" };
  }

  if (subjects > 50) {
    return { isValid: false, error: "Number of subjects seems unrealistic" };
  }

  return { isValid: true };
};

// GPA validation
export const validateGPA = (gpa: number): ValidationResult => {
  if (gpa == null || isNaN(gpa)) {
    return { isValid: false, error: "GPA must be a valid number" };
  }

  if (gpa < 0) {
    return { isValid: false, error: "GPA cannot be negative" };
  }

  if (gpa > 4.0) {
    return { isValid: false, error: "GPA cannot exceed 4.0" };
  }

  return { isValid: true };
};

// Input sanitization functions
export const sanitizeString = (input: string): string => {
  if (!input) return "";
  
  return input
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[<>]/g, ""); // Remove potential HTML characters
};

export const sanitizeName = (name: string): string => {
  if (!name) return "";
  
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return "";
  
  return email.trim().toLowerCase();
};

export const sanitizeStudentId = (studentId: string): string => {
  if (!studentId) return "";
  
  return studentId.trim().replace(/[^\d]/g, ""); // Keep only digits
};

export const sanitizeNumber = (value: string | number, decimals: number = 2): number => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return 0;
  
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const sanitizeInteger = (value: string | number): number => {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num)) return 0;
  
  return Math.floor(Math.abs(num)); // Ensure positive integer
};

// Batch validation
export interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (fields: Record<string, any>, validators: Record<string, (value: any) => ValidationResult>): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  for (const [fieldName, value] of Object.entries(fields)) {
    const validator = validators[fieldName];
    if (validator) {
      const result = validator(value);
      if (!result.isValid && result.error) {
        errors[fieldName] = result.error;
      }
    }
  }
  
  return errors;
};

// Utility to check if form has errors
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Rate limiting for form submissions
const submissionTimes = new Map<string, number>();

export const isRateLimited = (key: string, windowMs: number = 60000, maxAttempts: number = 5): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [k, time] of submissionTimes.entries()) {
    if (time < windowStart) {
      submissionTimes.delete(k);
    }
  }
  
  // Count attempts in current window
  let attempts = 0;
  for (const [k, time] of submissionTimes.entries()) {
    if (k.startsWith(key) && time >= windowStart) {
      attempts++;
    }
  }
  
  if (attempts >= maxAttempts) {
    return true;
  }
  
  // Record this attempt
  submissionTimes.set(`${key}_${now}`, now);
  return false;
}; 