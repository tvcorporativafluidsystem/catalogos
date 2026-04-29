import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do painel do Supabase (Project Settings > API)
const supabaseUrl = 'https://agygfdeizpfcdzxpukpx.supabase.co';
const supabaseKey = 'sb_publishable_5wjRsjZ15uwD22g2sifoAA_ev6c3r-c';

export const supabase = createClient(supabaseUrl, supabaseKey);