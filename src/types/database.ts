// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      academic_info: {
        Row: AcademicInfo;
        Insert: Omit<AcademicInfo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AcademicInfo, 'id' | 'user_id' | 'created_at'>>;
      };
      course_requests: {
        Row: CourseRequest;
        Insert: Omit<CourseRequest, 'id' | 'created_at' | 'updated_at' | 'expiration_date'>;
        Update: Partial<Omit<CourseRequest, 'id' | 'creator_id' | 'created_at'>>;
      };
      swap_requests: {
        Row: SwapRequest;
        Insert: Omit<SwapRequest, 'id' | 'created_at' | 'updated_at' | 'expires_at'>;
        Update: Partial<Omit<SwapRequest, 'id' | 'user_id' | 'created_at'>>;
      };
      practicum_groups: {
        Row: PracticumGroup;
        Insert: Omit<PracticumGroup, 'id' | 'created_at' | 'updated_at' | 'expires_at'>;
        Update: Partial<Omit<PracticumGroup, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
}

// User Profile
export interface Profile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

// Academic Information
export interface AcademicInfo {
  id?: number;
  user_id: string;
  total_grade_points: number;
  total_credits: number;
  current_subjects: number;
  created_at?: string;
  updated_at: string;
}

// Course Request
export interface CourseRequest {
  id: number;
  creator_id: string;
  creator_name: string;
  creator_student_id: string;
  course_name: string;
  slug: string;
  interested_students: InterestedStudent[];
  created_at: string;
  updated_at: string;
  expiration_date: string;
}

export interface InterestedStudent {
  name: string;
  student_id: string;
}

// Course Request Form Data
export interface CourseRequestFormData {
  creatorName: string;
  creatorStudentId: string;
  courseName: string;
  students: StudentEntry[];
}

export interface StudentEntry {
  id: string;
  name: string;
  studentId: string;
}

// Swap Request (updated to extend existing)
export interface SwapRequest {
  id: number;
  user_id: string;
  creator_name: string;
  creator_email: string;
  creator_student_id: string;
  course_name: string;
  current_section: string;
  target_section: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface SwapRequestFormData {
  courseName: string;
  currentSection: string;
  targetSection: string;
  studentId: string;
}

// Practicum Group
export interface PracticumGroup {
  id: number;
  user_id: string;
  creator_name: string;
  creator_email: string;
  publisher_student_id: string;
  title: string;
  description: string;
  tags: string[]; // majors
  notes: string | null;
  semester: string; // e.g., "Fall 2025"
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface PracticumGroupFormData {
  title: string;
  description: string;
  tags: string[];
  notes?: string;
  semester: string;
  publisherStudentId: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  page: number;
  limit: number;
} 