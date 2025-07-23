// Error handling and logging utilities
import React from "react";

export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NETWORK = "NETWORK",
  DATABASE = "DATABASE",
  UNKNOWN = "UNKNOWN",
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  userId?: string;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: AppError[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: AppError): void {
    // Add to memory storage
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error(`[${error.type}] ${error.message}`, {
        code: error.code,
        details: error.details,
        timestamp: new Date(error.timestamp).toISOString(),
        userId: error.userId,
      });
    }

    // In production, you might want to send to an external service
    // this.sendToExternalService(error);
  }

  getRecentErrors(count: number = 10): AppError[] {
    return this.errors.slice(0, count);
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter(error => error.type === type);
  }

}

// Error factory functions
export const createValidationError = (
  message: string,
  details?: any,
  userId?: string
): AppError => ({
  type: ErrorType.VALIDATION,
  message,
  details,
  timestamp: Date.now(),
  userId,
});

export const createAuthError = (
  message: string,
  code?: string,
  userId?: string
): AppError => ({
  type: ErrorType.AUTHENTICATION,
  message,
  code,
  timestamp: Date.now(),
  userId,
});

export const createNetworkError = (
  message: string,
  details?: any,
  userId?: string
): AppError => ({
  type: ErrorType.NETWORK,
  message,
  details,
  timestamp: Date.now(),
  userId,
});

export const createDatabaseError = (
  message: string,
  code?: string,
  details?: any,
  userId?: string
): AppError => ({
  type: ErrorType.DATABASE,
  message,
  code,
  details,
  timestamp: Date.now(),
  userId,
});

export const createUnknownError = (
  message: string,
  details?: any,
  userId?: string
): AppError => ({
  type: ErrorType.UNKNOWN,
  message,
  details,
  timestamp: Date.now(),
  userId,
});

// Error handling utility functions
export const handleAndLogError = (
  error: unknown,
  context: string,
  userId?: string
): string => {
  const logger = ErrorLogger.getInstance();
  let appError: AppError;

  if (error instanceof Error) {
    // Determine error type based on error message/properties
    if (error.message.includes("validation") || error.message.includes("invalid")) {
      appError = createValidationError(
        `${context}: ${error.message}`,
        { originalError: error },
        userId
      );
    } else if (error.message.includes("auth") || error.message.includes("unauthorized")) {
      appError = createAuthError(
        `${context}: ${error.message}`,
        undefined,
        userId
      );
    } else if (error.message.includes("network") || error.message.includes("fetch")) {
      appError = createNetworkError(
        `${context}: ${error.message}`,
        { originalError: error },
        userId
      );
    } else {
      appError = createUnknownError(
        `${context}: ${error.message}`,
        { originalError: error },
        userId
      );
    }
  } else if (typeof error === "string") {
    appError = createUnknownError(
      `${context}: ${error}`,
      undefined,
      userId
    );
  } else {
    appError = createUnknownError(
      `${context}: An unknown error occurred`,
      { originalError: error },
      userId
    );
  }

  logger.logError(appError);
  return appError.message;
};

// Retry mechanism with exponential backoff
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        break; // Don't delay on the last attempt
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Error boundary utility for React components
export const createErrorBoundary = (
  fallbackComponent: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const logger = ErrorLogger.getInstance();
      logger.logError(createUnknownError(
        `React Error Boundary: ${error.message}`,
        { error, errorInfo }
      ));
    }

    resetError = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError && this.state.error) {
        const FallbackComponent = fallbackComponent;
        return React.createElement(FallbackComponent, {
          error: this.state.error,
          resetError: this.resetError
        });
      }

      return this.props.children;
    }
  };
};

// User-friendly error messages
export const getFriendlyErrorMessage = (error: AppError, locale: 'en' | 'ar' = 'en'): string => {
  const messages = {
    en: {
      [ErrorType.VALIDATION]: "Please check your input and try again.",
      [ErrorType.AUTHENTICATION]: "Please sign in to continue.",
      [ErrorType.AUTHORIZATION]: "You don't have permission to perform this action.",
      [ErrorType.NETWORK]: "Please check your internet connection and try again.",
      [ErrorType.DATABASE]: "We're experiencing technical difficulties. Please try again later.",
      [ErrorType.UNKNOWN]: "Something went wrong. Please try again.",
    },
    ar: {
      [ErrorType.VALIDATION]: "يرجى التحقق من المدخلات والمحاولة مرة أخرى.",
      [ErrorType.AUTHENTICATION]: "يرجى تسجيل الدخول للمتابعة.",
      [ErrorType.AUTHORIZATION]: "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
      [ErrorType.NETWORK]: "يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
      [ErrorType.DATABASE]: "نواجه صعوبات تقنية. يرجى المحاولة مرة أخرى لاحقاً.",
      [ErrorType.UNKNOWN]: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    },
  };

  return messages[locale][error.type] || messages[locale][ErrorType.UNKNOWN];
};

// Error reporting for user feedback
export interface ErrorReport {
  errorId: string;
  userDescription?: string;
  userEmail?: string;
  timestamp: number;
  error: AppError;
}

export const submitErrorReport = async (
  error: AppError,
  userDescription?: string,
  userEmail?: string
): Promise<{ success: boolean; errorId?: string }> => {
  try {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const report: ErrorReport = {
      errorId,
      userDescription,
      userEmail,
      timestamp: Date.now(),
      error,
    };

    // In a real application, you would send this to your backend
    console.log("Error report submitted:", report);

    return { success: true, errorId };
  } catch (reportError) {
    console.error("Failed to submit error report:", reportError);
    return { success: false };
  }
};

// Performance monitoring
export const measurePerformance = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log slow operations
    if (duration > 1000) { // More than 1 second
      console.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    handleAndLogError(
      error,
      `Performance measurement for ${operationName} (failed after ${duration.toFixed(2)}ms)`
    );
    
    throw error;
  }
}; 