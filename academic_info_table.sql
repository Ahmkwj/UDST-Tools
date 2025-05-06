-- Create academic_info table in Supabase
CREATE TABLE academic_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_grade_points NUMERIC(10, 3) NOT NULL DEFAULT 0,
  total_credits INTEGER NOT NULL DEFAULT 0,
  current_subjects INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE academic_info ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to only see and modify their own academic info
CREATE POLICY "Users can view their own academic info" 
  ON academic_info 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own academic info" 
  ON academic_info 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own academic info" 
  ON academic_info 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own academic info" 
  ON academic_info 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for faster lookups
CREATE INDEX academic_info_user_id_idx ON academic_info(user_id);

-- Add a trigger to update the updated_at field
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_academic_info_timestamp
BEFORE UPDATE ON academic_info
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column(); 