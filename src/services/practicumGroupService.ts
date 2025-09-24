import { supabase, handleSupabaseError, withRetry } from "../utils/supabaseClient";
import { PracticumGroup, PracticumGroupFormData, ApiResponse, PaginatedResponse, QueryParams } from "../types/database";

export interface PracticumGroupServiceInterface {
  createGroup: (data: PracticumGroupFormData, userId: string, userEmail: string, userName: string) => Promise<ApiResponse<PracticumGroup>>;
  getGroupById: (id: number) => Promise<ApiResponse<PracticumGroup>>;
  getGroupsByUser: (userId: string, params?: QueryParams) => Promise<PaginatedResponse<PracticumGroup>>;
  getOpenGroups: (params?: QueryParams) => Promise<PaginatedResponse<PracticumGroup>>;
  getAllGroups: (params?: QueryParams) => Promise<PaginatedResponse<PracticumGroup>>;
  updateGroup: (id: number, data: Partial<PracticumGroup>, userId: string) => Promise<ApiResponse<PracticumGroup>>;
  deleteGroup: (id: number, userId: string) => Promise<ApiResponse<boolean>>;
  updateGroupStatus: (id: number, status: 'open' | 'closed', userId: string) => Promise<ApiResponse<PracticumGroup>>;
}

class PracticumGroupServiceImpl implements PracticumGroupServiceInterface {
  async createGroup(
    data: PracticumGroupFormData,
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<ApiResponse<PracticumGroup>> {
    try {
      if (!data.title?.trim()) throw new Error("Group title is required");
      if (!data.description?.trim()) throw new Error("Project description is required");
      if (!Array.isArray(data.tags) || data.tags.length === 0) throw new Error("At least one major tag is required");
      if (!data.semester?.trim()) throw new Error("Semester is required");
      if (!data.publisherStudentId?.trim()) throw new Error("Publisher student ID is required");
      if (!/^\d+$/.test(data.publisherStudentId.trim())) throw new Error("Student ID must contain only numbers");
      if (!userId) throw new Error("User authentication required");

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const insertData = {
        user_id: userId,
        creator_name: userName || "Unknown",
        creator_email: userEmail || "",
        publisher_student_id: data.publisherStudentId.trim(),
        title: data.title.trim(),
        description: data.description.trim(),
        tags: data.tags.map(t => t.trim()).filter(Boolean),
        notes: data.notes?.trim() || null,
        semester: data.semester.trim(),
        status: "open" as const,
        expires_at: expiresAt.toISOString(),
      };

      const { data: insertedData, error } = await withRetry(async () =>
        supabase.from("practicum_groups").insert([insertData]).select().single()
      );

      if (error) throw error;
      return { data: insertedData, error: null, loading: false };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error), loading: false };
    }
  }

  async getGroupById(id: number): Promise<ApiResponse<PracticumGroup>> {
    try {
      if (!id || id <= 0) throw new Error("Valid practicum group ID is required");

      const { data, error } = await withRetry(async () =>
        supabase.from("practicum_groups").select("*").eq("id", id).single()
      );

      if (error) throw error;
      return { data, error: null, loading: false };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error), loading: false };
    }
  }

  async getGroupsByUser(
    userId: string,
    params: QueryParams = {}
  ): Promise<PaginatedResponse<PracticumGroup>> {
    try {
      if (!userId) throw new Error("User ID is required");

      const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = params;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("practicum_groups")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .range(offset, offset + limit - 1)
        .order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error, count } = await withRetry(async () => query);
      if (error) throw error;

      return { data: data || [], count: count || 0, hasMore: count ? offset + limit < count : false, page, limit };
    } catch (error) {
      return { data: [], count: 0, hasMore: false, page: params.page || 1, limit: params.limit || 10 };
    }
  }

  async getAllGroups(params: QueryParams = {}): Promise<PaginatedResponse<PracticumGroup>> {
    try {
      const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc", filters } = params;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("practicum_groups")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1)
        .order(sortBy, { ascending: sortOrder === "asc" });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error, count } = await withRetry(async () => query);
      if (error) throw error;

      return { data: data || [], count: count || 0, hasMore: count ? offset + limit < count : false, page, limit };
    } catch (error) {
      return { data: [], count: 0, hasMore: false, page: params.page || 1, limit: params.limit || 10 };
    }
  }

  async getOpenGroups(params: QueryParams = {}): Promise<PaginatedResponse<PracticumGroup>> {
    const filtersWithStatus = { ...params.filters, status: "open" };
    return this.getAllGroups({ ...params, filters: filtersWithStatus });
  }

  async updateGroupStatus(
    id: number,
    status: 'open' | 'closed',
    userId: string
  ): Promise<ApiResponse<PracticumGroup>> {
    try {
      if (!id || id <= 0) throw new Error("Valid practicum group ID is required");
      if (!userId) throw new Error("User ID is required");
      if (!['open', 'closed'].includes(status)) throw new Error("Status must be 'open' or 'closed'");

      const { data, error } = await withRetry(async () =>
        supabase.from("practicum_groups").update({ status }).eq("id", id).eq("user_id", userId).select().single()
      );

      if (error) throw error;
      return { data, error: null, loading: false };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error), loading: false };
    }
  }

  async deleteGroup(id: number, userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!id || id <= 0) throw new Error("Valid practicum group ID is required");
      if (!userId) throw new Error("User ID is required");

      const { error } = await withRetry(async () =>
        supabase.from("practicum_groups").delete().eq("id", id).eq("user_id", userId)
      );

      if (error) throw error;
      return { data: true, error: null, loading: false };
    } catch (error) {
      return { data: false, error: handleSupabaseError(error), loading: false };
    }
  }

  async updateGroup(
    id: number,
    data: Partial<PracticumGroup>,
    userId: string
  ): Promise<ApiResponse<PracticumGroup>> {
    try {
      if (!id || id <= 0) throw new Error("Valid practicum group ID is required");
      if (!userId) throw new Error("User ID is required");

      const sanitized: Partial<PracticumGroup> = { ...data };
      delete (sanitized as any).id;
      delete (sanitized as any).user_id;
      delete (sanitized as any).created_at;
      delete (sanitized as any).expires_at;

      if (sanitized.title !== undefined && !sanitized.title?.trim()) throw new Error("Title cannot be empty");
      if (sanitized.description !== undefined && !sanitized.description?.trim()) throw new Error("Description cannot be empty");
      if (sanitized.semester !== undefined && !sanitized.semester?.trim()) throw new Error("Semester cannot be empty");
      if (sanitized.publisher_student_id !== undefined && !/^\d+$/.test(String(sanitized.publisher_student_id))) throw new Error("Student ID must contain only numbers");

      if (sanitized.title) sanitized.title = sanitized.title.trim();
      if (sanitized.description) sanitized.description = sanitized.description.trim();
      if (sanitized.notes !== undefined) sanitized.notes = sanitized.notes?.trim() || null;
      if (sanitized.tags) sanitized.tags = sanitized.tags.map(t => t.trim()).filter(Boolean);
      if (sanitized.semester) sanitized.semester = sanitized.semester.trim();
      if (sanitized.publisher_student_id) sanitized.publisher_student_id = String(sanitized.publisher_student_id).trim();

      const { data: updated, error } = await withRetry(async () =>
        supabase.from("practicum_groups").update(sanitized).eq("id", id).eq("user_id", userId).select().single()
      );

      if (error) throw error;
      return { data: updated, error: null, loading: false };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error), loading: false };
    }
  }
}

export const practicumGroupService = new PracticumGroupServiceImpl();
