import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// We use the service_role key to bypass RLS in the backend if needed, 
// or for administrative tasks. For user-specific actions, we should 
// ideally use the user's token or rely on backend logic.
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
