import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPA_URL = 'https://rmczoqutcuvrlvlmfxze.supabase.co';
const SUPA_KEY = 'sb_publishable_mK9kyeWeOiYAc7lMBFiu4A_e3pwEaLT';

export const supabase: SupabaseClient = createClient(SUPA_URL, SUPA_KEY, {
  realtime: { params: { eventsPerSecond: 10 } },
});
