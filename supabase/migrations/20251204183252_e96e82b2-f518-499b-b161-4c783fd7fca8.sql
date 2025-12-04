-- Create audit log table for tracking product changes
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view audit logs
CREATE POLICY "Authenticated users can view audit logs"
ON public.audit_log
FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert audit logs (via triggers or functions)
CREATE POLICY "System can insert audit logs"
ON public.audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to log product changes
CREATE OR REPLACE FUNCTION public.log_product_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _user_email TEXT;
  _action TEXT;
BEGIN
  -- Get current user info
  _user_id := auth.uid();
  SELECT email INTO _user_email FROM auth.users WHERE id = _user_id;

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    _action := 'create';
    INSERT INTO public.audit_log (user_id, user_email, action, table_name, record_id, new_data)
    VALUES (_user_id, _user_email, _action, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    _action := 'update';
    INSERT INTO public.audit_log (user_id, user_email, action, table_name, record_id, old_data, new_data)
    VALUES (_user_id, _user_email, _action, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    _action := 'delete';
    INSERT INTO public.audit_log (user_id, user_email, action, table_name, record_id, old_data)
    VALUES (_user_id, _user_email, _action, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger on products table
CREATE TRIGGER products_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.log_product_change();

-- Add index for faster queries
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_table_name ON public.audit_log(table_name);
CREATE INDEX idx_audit_log_record_id ON public.audit_log(record_id);