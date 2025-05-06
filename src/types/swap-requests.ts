export type SwapRequest = {
  id: number;
  user_id: string;
  creator_name: string;
  creator_email: string;
  creator_student_id: string;
  course_name: string;
  current_section: string;
  target_section: string;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  expires_at: string;
};

export type SwapRequestFormData = {
  courseName: string;
  currentSection: string;
  targetSection: string;
  studentId: string;
};
