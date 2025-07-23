import { nanoid } from "nanoid";
import { supabase, handleSupabaseError, withRetry } from "../utils/supabaseClient";
import { CourseRequest, CourseRequestFormData, InterestedStudent, ApiResponse, PaginatedResponse, QueryParams } from "../types/database";

export interface CourseRequestServiceInterface {
  createCourseRequest: (data: CourseRequestFormData, userId: string) => Promise<ApiResponse<CourseRequest>>;
  getCourseRequestBySlug: (slug: string) => Promise<ApiResponse<CourseRequest>>;
  getCourseRequestsByUser: (userId: string, params?: QueryParams) => Promise<PaginatedResponse<CourseRequest>>;
  addStudentToCourseRequest: (slug: string, student: InterestedStudent) => Promise<ApiResponse<CourseRequest>>;
  deleteCourseRequest: (slug: string, userId: string) => Promise<ApiResponse<boolean>>;
  updateCourseRequest: (slug: string, data: Partial<CourseRequest>, userId: string) => Promise<ApiResponse<CourseRequest>>;
  getAllCourseRequests: (params?: QueryParams) => Promise<PaginatedResponse<CourseRequest>>;
}

class CourseRequestServiceImpl implements CourseRequestServiceInterface {
  /**
   * Create a new course request
   */
  async createCourseRequest(
    data: CourseRequestFormData,
    userId: string
  ): Promise<ApiResponse<CourseRequest>> {
    try {
      // Validate required fields
      if (!data.creatorName?.trim()) {
        throw new Error("Creator name is required");
      }

      if (!data.creatorStudentId?.trim()) {
        throw new Error("Creator student ID is required");
      }

      if (!data.courseName?.trim()) {
        throw new Error("Course name is required");
      }

      if (!userId) {
        throw new Error("User authentication required");
      }

      // Validate students
      const validStudents = data.students.filter(s => s.name?.trim() && s.studentId?.trim());
      if (validStudents.length === 0) {
        throw new Error("At least one interested student is required");
      }

      // Validate student IDs (assuming they should be numeric)
      const studentIdRegex = /^\d+$/;
      if (!studentIdRegex.test(data.creatorStudentId.trim())) {
        throw new Error("Creator student ID must contain only numbers");
      }

      for (const student of validStudents) {
        if (!studentIdRegex.test(student.studentId.trim())) {
          throw new Error(`Student ID "${student.studentId}" must contain only numbers`);
        }
      }

      // Check for duplicate student IDs
      const studentIds = validStudents.map(s => s.studentId.trim());
      const uniqueStudentIds = new Set(studentIds);
      if (studentIds.length !== uniqueStudentIds.size) {
        throw new Error("Duplicate student IDs are not allowed");
      }

      // Generate unique slug
      const slug = nanoid(8);

      // Format student data for storage
      const interestedStudents: InterestedStudent[] = validStudents.map(s => ({
        name: s.name.trim(),
        student_id: s.studentId.trim(),
      }));

      // Prepare data for insertion
      const insertData = {
        creator_id: userId,
        creator_name: data.creatorName.trim(),
        creator_student_id: data.creatorStudentId.trim(),
        course_name: data.courseName.trim(),
        slug,
        interested_students: interestedStudents,
      };

      const { data: insertedData, error } = await withRetry(async () => {
        return await supabase
          .from("course_requests")
          .insert([insertData])
          .select()
          .single();
      });

      if (error) {
        throw error;
      }

      return { data: insertedData, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }

  /**
   * Get course request by slug
   */
  async getCourseRequestBySlug(slug: string): Promise<ApiResponse<CourseRequest>> {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }

      const { data, error } = await withRetry(async () => {
        return await supabase
          .from("course_requests")
          .select("*")
          .eq("slug", slug)
          .single();
      });

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Course request not found");
        }
        throw error;
      }

      return { data, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }

  /**
   * Get course requests by user
   */
  async getCourseRequestsByUser(
    userId: string,
    params: QueryParams = {}
  ): Promise<PaginatedResponse<CourseRequest>> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = params;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("course_requests")
        .select("*", { count: "exact" })
        .eq("creator_id", userId)
        .range(offset, offset + limit - 1);

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error, count } = await withRetry(async () => query);

      if (error) {
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
        hasMore: count ? offset + limit < count : false,
        page,
        limit,
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        hasMore: false,
        page: params.page || 1,
        limit: params.limit || 10,
      };
    }
  }

  /**
   * Add student to course request
   */
  async addStudentToCourseRequest(
    slug: string,
    student: InterestedStudent
  ): Promise<ApiResponse<CourseRequest>> {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }

      if (!student.name?.trim() || !student.student_id?.trim()) {
        throw new Error("Student name and ID are required");
      }

      // Validate student ID format
      const studentIdRegex = /^\d+$/;
      if (!studentIdRegex.test(student.student_id.trim())) {
        throw new Error("Student ID must contain only numbers");
      }

      // Get current course request
      const currentRequest = await this.getCourseRequestBySlug(slug);
      if (currentRequest.error || !currentRequest.data) {
        throw new Error("Course request not found");
      }

      // Check for duplicate student ID
      const existingStudentIds = currentRequest.data.interested_students.map(s => s.student_id);
      if (existingStudentIds.includes(student.student_id.trim())) {
        throw new Error("Student with this ID is already added");
      }

      // Add new student
      const updatedStudents = [
        ...currentRequest.data.interested_students,
        {
          name: student.name.trim(),
          student_id: student.student_id.trim(),
        },
      ];

      const { data, error } = await withRetry(async () => {
        return await supabase
          .from("course_requests")
          .update({ interested_students: updatedStudents })
          .eq("slug", slug)
          .select()
          .single();
      });

      if (error) {
        throw error;
      }

      return { data, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }

  /**
   * Delete course request
   */
  async deleteCourseRequest(slug: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!slug || !userId) {
        throw new Error("Slug and user ID are required");
      }

      const { error } = await withRetry(async () => {
        return await supabase
          .from("course_requests")
          .delete()
          .eq("slug", slug)
          .eq("creator_id", userId);
      });

      if (error) {
        throw error;
      }

      return { data: true, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: false, error: message, loading: false };
    }
  }

  /**
   * Update course request
   */
  async updateCourseRequest(
    slug: string,
    data: Partial<CourseRequest>,
    userId: string
  ): Promise<ApiResponse<CourseRequest>> {
    try {
      if (!slug || !userId) {
        throw new Error("Slug and user ID are required");
      }

      // Remove fields that shouldn't be updated
      const sanitizedData = { ...data };
      delete sanitizedData.id;
      delete sanitizedData.creator_id;
      delete sanitizedData.slug;
      delete (sanitizedData as any).created_at;

      const { data: updatedData, error } = await withRetry(async () => {
        return await supabase
          .from("course_requests")
          .update(sanitizedData)
          .eq("slug", slug)
          .eq("creator_id", userId)
          .select()
          .single();
      });

      if (error) {
        throw error;
      }

      return { data: updatedData, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }

  /**
   * Get all course requests (admin function)
   */
  async getAllCourseRequests(params: QueryParams = {}): Promise<PaginatedResponse<CourseRequest>> {
    try {
      const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = params;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("course_requests")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1);

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error, count } = await withRetry(async () => query);

      if (error) {
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
        hasMore: count ? offset + limit < count : false,
        page,
        limit,
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        hasMore: false,
        page: params.page || 1,
        limit: params.limit || 10,
      };
    }
  }
}

// Export singleton instance
export const courseRequestService = new CourseRequestServiceImpl(); 