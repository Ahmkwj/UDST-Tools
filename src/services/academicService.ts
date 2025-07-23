import { supabase, handleSupabaseError, withRetry } from "../utils/supabaseClient";
import { AcademicInfo, ApiResponse } from "../types/database";

export interface AcademicServiceInterface {
  getAcademicInfo: (userId: string) => Promise<ApiResponse<AcademicInfo>>;
  saveAcademicInfo: (data: Omit<AcademicInfo, 'id' | 'created_at'>) => Promise<ApiResponse<AcademicInfo>>;
  updateAcademicInfo: (userId: string, data: Partial<AcademicInfo>) => Promise<ApiResponse<AcademicInfo>>;
  deleteAcademicInfo: (userId: string) => Promise<ApiResponse<boolean>>;
}

class AcademicServiceImpl implements AcademicServiceInterface {
  /**
   * Get academic information for a user
   */
  async getAcademicInfo(userId: string): Promise<ApiResponse<AcademicInfo>> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { data, error } = await withRetry(async () => {
        return await supabase
          .from("academic_info")
          .select("*")
          .eq("user_id", userId)
          .single();
      });

      if (error) {
        if (error.code === "PGRST116") {
          // No data found - this is OK, return null
          return { data: null, error: null, loading: false };
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
   * Save new academic information
   */
  async saveAcademicInfo(
    data: Omit<AcademicInfo, 'id' | 'created_at'>
  ): Promise<ApiResponse<AcademicInfo>> {
    try {
      // Validate required fields
      if (!data.user_id) {
        throw new Error("User ID is required");
      }

      // Validate numeric fields
      if (data.total_grade_points < 0) {
        throw new Error("Total grade points cannot be negative");
      }

      if (data.total_credits < 0) {
        throw new Error("Total credits cannot be negative");
      }

      if (data.current_subjects < 0) {
        throw new Error("Current subjects cannot be negative");
      }

      // Check if GPA is realistic (assuming 4.0 scale)
      const gpa = data.total_credits > 0 ? data.total_grade_points / data.total_credits : 0;
      if (gpa > 4.0) {
        throw new Error("GPA cannot exceed 4.0");
      }

      // Sanitize data
      const sanitizedData = {
        user_id: data.user_id,
        total_grade_points: Math.round(data.total_grade_points * 100) / 100, // Round to 2 decimal places
        total_credits: Math.round(data.total_credits * 100) / 100,
        current_subjects: Math.floor(data.current_subjects), // Ensure integer
        updated_at: new Date().toISOString(),
      };

      // Check if record already exists
      const existingRecord = await this.getAcademicInfo(data.user_id);
      
      let result;
      if (existingRecord.data) {
        // Update existing record
        result = await this.updateAcademicInfo(data.user_id, sanitizedData);
      } else {
        // Insert new record
        const { data: insertData, error } = await withRetry(async () => {
          return await supabase
            .from("academic_info")
            .insert([sanitizedData])
            .select()
            .single();
        });

        if (error) {
          throw error;
        }

        result = { data: insertData, error: null, loading: false };
      }

      return result;
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }

  /**
   * Update existing academic information
   */
  async updateAcademicInfo(
    userId: string,
    data: Partial<AcademicInfo>
  ): Promise<ApiResponse<AcademicInfo>> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Validate numeric fields if provided
      if (data.total_grade_points !== undefined && data.total_grade_points < 0) {
        throw new Error("Total grade points cannot be negative");
      }

      if (data.total_credits !== undefined && data.total_credits < 0) {
        throw new Error("Total credits cannot be negative");
      }

      if (data.current_subjects !== undefined && data.current_subjects < 0) {
        throw new Error("Current subjects cannot be negative");
      }

      // Sanitize data
      const sanitizedData: Partial<AcademicInfo> = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Remove fields that shouldn't be updated
      delete sanitizedData.id;
      delete sanitizedData.user_id;
      delete (sanitizedData as any).created_at;

      // Round numeric values if provided
      if (sanitizedData.total_grade_points !== undefined) {
        sanitizedData.total_grade_points = Math.round(sanitizedData.total_grade_points * 100) / 100;
      }

      if (sanitizedData.total_credits !== undefined) {
        sanitizedData.total_credits = Math.round(sanitizedData.total_credits * 100) / 100;
      }

      if (sanitizedData.current_subjects !== undefined) {
        sanitizedData.current_subjects = Math.floor(sanitizedData.current_subjects);
      }

      const { data: updateData, error } = await withRetry(async () => {
        return await supabase
          .from("academic_info")
          .update(sanitizedData)
          .eq("user_id", userId)
          .select()
          .single();
      });

      if (error) {
        throw error;
      }

      return { data: updateData, error: null, loading: false };
    } catch (error) {
      const message = handleSupabaseError(error);
      return { data: null, error: message, loading: false };
    }
  }

  /**
   * Delete academic information for a user
   */
  async deleteAcademicInfo(userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { error } = await withRetry(async () => {
        return await supabase
          .from("academic_info")
          .delete()
          .eq("user_id", userId);
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
}

// Export singleton instance
export const academicService = new AcademicServiceImpl(); 