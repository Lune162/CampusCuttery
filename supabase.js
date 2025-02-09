<!DOCTYPE html>
<html>
  <script type="module">
    // Importing Supabase client
    import { createClient } from "https://cdn.skypack.dev/pin/@supabase/supabase-js@v2.48.1-Y3P1PoFF2eatCaxdnjxz/mode=imports,min/optimized/@supabase/supabase-js.js";

    // Creating the Supabase client
    const supabase = createClient(
      "https://ocjkzxaaqbsmmcveuxxn.supabase.co",  // Your Supabase URL
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jamt6eGFhcWJzbW1jdmV1eHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjgzNTEsImV4cCI6MjA1NDcwNDM1MX0.Ha8jMv6pewZAka5NV4N8Tj6olp6LlsqYpJvcgUQW_1w"  // Your Supabase API Key
    );

    // Example query to fetch data
    (async () => {
      const { error, data } = await supabase.from("your_table_name").select();
      if (error) {
        document.body.innerHTML = `<pre>${JSON.stringify(error, null, 2)}</pre>`;
      } else {
        document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
    })();
  </script>
</html>
