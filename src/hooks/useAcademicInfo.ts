import { useState, useEffect, useCallback } from "react";
import { academicService } from "../services/academicService";
import { AcademicInfo } from "../types/database";

interface UseAcademicInfoReturn {
  academicInfo: AcademicInfo | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveAcademicInfo: (data: Omit<AcademicInfo, 'id' | 'created_at'>) => Promise<{ success: boolean; error: string | null }>;
  updateAcademicInfo: (data: Partial<AcademicInfo>) => Promise<{ success: boolean; error: string | null }>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useAcademicInfo = (userId: string | null): UseAcademicInfoReturn => {
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch academic info
  const fetchAcademicInfo = useCallback(async () => {
    if (!userId) {
      setAcademicInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await academicService.getAcademicInfo(userId);
      
      if (result.error) {
        setError(result.error);
      } else {
        setAcademicInfo(result.data);
      }
    } catch (error) {
      setError("Failed to load academic information");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load data on mount and user change
  useEffect(() => {
    fetchAcademicInfo();
  }, [fetchAcademicInfo]);

  // Save academic info
  const saveAcademicInfo = useCallback(async (
    data: Omit<AcademicInfo, 'id' | 'created_at'>
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!userId) {
      return { success: false, error: "User authentication required" };
    }

    setSaving(true);
    setError(null);

    try {
      const result = await academicService.saveAcademicInfo(data);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setAcademicInfo(result.data);
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = "Failed to save academic information";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [userId]);

  // Update academic info
  const updateAcademicInfo = useCallback(async (
    data: Partial<AcademicInfo>
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!userId) {
      return { success: false, error: "User authentication required" };
    }

    setSaving(true);
    setError(null);

    try {
      const result = await academicService.updateAcademicInfo(userId, data);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setAcademicInfo(result.data);
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = "Failed to update academic information";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [userId]);

  // Refetch data
  const refetch = useCallback(async () => {
    await fetchAcademicInfo();
  }, [fetchAcademicInfo]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    academicInfo,
    loading,
    saving,
    error,
    saveAcademicInfo,
    updateAcademicInfo,
    refetch,
    clearError,
  };
}; 