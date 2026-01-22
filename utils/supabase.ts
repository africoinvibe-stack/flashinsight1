import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://obtruvcqunbkdcyielxa.supabase.co';
const supabaseAnonKey = 'sb_publishable_LKdDx_ZyGhKykdb1VfzFOw_lQpjsjpi'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);