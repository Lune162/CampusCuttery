import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ocjkzxaaqbsmmcveuxxn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jamt6eGFhcWJzbW1jdmV1eHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjgzNTEsImV4cCI6MjA1NDcwNDM1MX0.Ha8jMv6pewZAka5NV4N8Tj6olp6LlsqYpJvcgUQW_1w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Now you can use supabase.from
supabase.from('your_table').select('*').then(response => {
  // Handle data
});