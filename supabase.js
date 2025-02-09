// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/dist/umd/supabase.min.js';

const supabaseUrl = "https://ocjkzxaaqbsmmcveuxxn.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jamt6eGFhcWJzbW1jdmV1eHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjgzNTEsImV4cCI6MjA1NDcwNDM1MX0.Ha8jMv6pewZAka5NV4N8Tj6olp6LlsqYpJvcgUQW_1w";  // Replace with your Supabase Key
const supabase = createClient(supabaseUrl, supabaseKey);

console.log(supabase);

export { supabase };  // Export the client
