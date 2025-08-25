-- Add parent_task_id column to support subtasks
ALTER TABLE public.tasks 
ADD COLUMN parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE;

-- Add index for better performance when querying subtasks
CREATE INDEX idx_tasks_parent_task_id ON public.tasks(parent_task_id);

-- Add index for user_id for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);

-- Update RLS policies to include subtasks
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- Recreate policies with subtask support
CREATE POLICY "Users can view their own tasks and subtasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks and subtasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks and subtasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks and subtasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);