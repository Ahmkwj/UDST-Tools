/**
 * Custom type declarations for missing type definitions
 */

// Explicitly declare Jest types to prevent TypeScript from looking for the @types/jest package
declare namespace jest {
  interface Jest {}
}

// Declare a global Jest object
declare const jest: jest.Jest;

// If there are React 2 related type issues, add declarations here
declare namespace React {
  // Add any missing React type declarations if needed
}

// Any additional type declarations should go here
