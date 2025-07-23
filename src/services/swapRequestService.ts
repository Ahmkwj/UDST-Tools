import { supabase, handleSupabaseError, withRetry } from "../utils/supabaseClient";
import { SwapRequest, SwapRequestFormData, ApiResponse, PaginatedResponse, QueryParams } from "../types/database";

export interface SwapRequestServiceInterface {
  createSwapRequest: (data: SwapRequestFormData, userId: string, userEmail: string, userName: string) => Promise<ApiResponse<SwapRequest>>;
  getSwapRequestById: (id: number) => Promise<ApiResponse<SwapRequest>>;
  getSwapRequestsByUser: (userId: string, params?: QueryParams) => Promise<PaginatedResponse<SwapRequest>>;
  getAllSwapRequests: (params?: QueryParams) => Promise<PaginatedResponse<SwapRequest>>;
  getOpenSwapRequests: (params?: QueryParams) => Promise<PaginatedResponse<SwapRequest>>;
  updateSwapRequestStatus: (id: number, status: 'open' | 'closed', userId: string) => Promise<ApiResponse<SwapRequest>>;
  deleteSwapRequest: (id: number, userId: string) => Promise<ApiResponse<boolean>>;
  updateSwapRequest: (id: number, data: Partial<SwapRequest>, userId: string) => Promise<ApiResponse<SwapRequest>>;
}

class SwapRequestServiceImpl implements SwapRequestServiceInterface {
  /**
   * Create a new swap request
   */
  async createSwapRequest(
    data: SwapRequestFormData,
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<ApiResponse<SwapRequest>> {
    try {
      // Validate required fields
      if (!data.courseName?.trim()) {
        throw new Error("Course name is required");
      }

      if (!data.currentSection?.trim()) {
        throw new Error("Current section is required");
      }

      if (!data.targetSection?.trim()) {
        throw new Error("Target section is required");
      }

      if (!data.studentId?.trim()) {
        throw new Error("Student ID is required");
      }

      if (!userId) {
        throw new Error("User authentication required");
      }

      // Validate student ID format
      const studentIdRegex = /^\d+$/;
      if (!studentIdRegex.test(data.studentId.trim())) {
        throw new Error("Student ID must contain only numbers");
      }

      // Validate sections are different
      if (data.currentSection.trim().toLowerCase() === data.targetSection.trim().toLowerCase()) {
        throw new Error("Current section and target section must be different");
      }

      // Calculate expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Prepare data for insertion
      const insertData = {
        user_id: userId,
        creator_name: userName || "Unknown",
        creator_email: userEmail || "",
        creator_student_id: data.studentId.trim(),
        course_name: data.courseName.trim(),
        current_section: data.currentSection.trim(),
        target_section: data.targetSection.trim(),
        status: "open" as const,
        expires_at: expiresAt.toISOString(),
      };

      const { data: insertedData, error } = await withRetry(async () => {
        return await supabase
          .from("swap_requests")
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
   * Get swap request by ID
   */
  async getSwapRequestById(id: number): Promise<ApiResponse<SwapRequest>> {
    try {
      if (!id || id <= 0) {
        throw new Error("Valid swap request ID is required");
      }

      const { data, error } = await withRetry(async () => {
        return await supabase
          .from("swap_requests")
          .select("*")
          .eq("id", id)
          .single();
      });

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Swap request not found");
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
   * Get swap requests by user
   */
  async getSwapRequestsByUser(
    userId: string,
    params: QueryParams = {}
  ): Promise<PaginatedResponse<SwapRequest>> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = params;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("swap_requests")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
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
   * Get all swap requests
   */
  async getAllSwapRequests(params: QueryParams = {}): Promise<PaginatedResponse<SwapRequest>> {
    try {
      const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc", filters } = params;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("swap_requests")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

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
   * Get open swap requests only
   */
  async getOpenSwapRequests(params: QueryParams = {}): Promise<PaginatedResponse<SwapRequest>> {
    const filtersWithStatus = {
      ...params.filters,
      status: "open",
    };

    return this.getAllSwapRequests({
      ...params,
      filters: filtersWithStatus,
    });
  }

  /**
   * Update swap request status
   */
  async updateSwapRequestStatus(
    id: number,
    status: 'open' | 'closed',
    userId: string
  ): Promise<ApiResponse<SwapRequest>> {
    try {
      if (!id || id <= 0) {
        throw new Error("Valid swap request ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!['open', 'closed'].includes(status)) {
        throw new Error("Status must be either 'open' or 'closed'");
      }

      const { data, error } = await withRetry(async () => {
        return await supabase
          .from("swap_requests")
          .update({ status })
          .eq("id", id)
          .eq("user_id", userId) // Ensure user owns the request
          .select()
          .single();
      });

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Swap request not found or access denied");
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
   * Delete swap request
   */
  async deleteSwapRequest(id: number, userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!id || id <= 0) {
        throw new Error("Valid swap request ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const { error } = await withRetry(async () => {
        return await supabase
          .from("swap_requests")
          .delete()
          .eq("id", id)
          .eq("user_id", userId); // Ensure user owns the request
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
   * Update swap request
   */
  async updateSwapRequest(
    id: number,
    data: Partial<SwapRequest>,
    userId: string
  ): Promise<ApiResponse<SwapRequest>> {
    try {
      if (!id || id <= 0) {
        throw new Error("Valid swap request ID is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      // Remove fields that shouldn't be updated
      const sanitizedData = { ...data };
      delete sanitizedData.id;
      delete sanitizedData.user_id;
      delete (sanitizedData as any).created_at;
      delete (sanitizedData as any).expires_at;

      // Validate course name if provided
      if (sanitizedData.course_name !== undefined && !sanitizedData.course_name?.trim()) {
        throw new Error("Course name cannot be empty");
      }

      // Validate sections if provided
      if (sanitizedData.current_section !== undefined && !sanitizedData.current_section?.trim()) {
        throw new Error("Current section cannot be empty");
      }

      if (sanitizedData.target_section !== undefined && !sanitizedData.target_section?.trim()) {
        throw new Error("Target section cannot be empty");
      }

      // Validate sections are different if both are provided
      if (sanitizedData.current_section && sanitizedData.target_section) {
        if (sanitizedData.current_section.trim().toLowerCase() === sanitizedData.target_section.trim().toLowerCase()) {
          throw new Error("Current section and target section must be different");
        }
      }

      // Trim string fields
      if (sanitizedData.course_name) {
        sanitizedData.course_name = sanitizedData.course_name.trim();
      }
      if (sanitizedData.current_section) {
        sanitizedData.current_section = sanitizedData.current_section.trim();
      }
      if (sanitizedData.target_section) {
        sanitizedData.target_section = sanitizedData.target_section.trim();
      }

      const { data: updatedData, error } = await withRetry(async () => {
        return await supabase
          .from("swap_requests")
          .update(sanitizedData)
          .eq("id", id)
          .eq("user_id", userId) // Ensure user owns the request
          .select()
          .single();
      });

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Swap request not found or access denied");
        }
        throw error;
      }

      return { data: updatedData, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }
}

// Export singleton instance
export const swapRequestService = new SwapRequestServiceImpl(); 