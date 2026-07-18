import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vokpfzlqmbpaeewqmejw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZva3BmemxxbWJwYWVld3FtZWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNDY5NzUsImV4cCI6MjA5OTkyMjk3NX0.qk8V4Vv7wqlpZv7vedfZcA11EpmYheTyK3k4MqMU7LA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
