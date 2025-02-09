// Initialize Supabase
const supabaseUrl = "https://ocjkzxaaqbsmmcveuxxn.supabase.co";  // Replace with your Supabase project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jamt6eGFhcWJzbW1jdmV1eHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjgzNTEsImV4cCI6MjA1NDcwNDM1MX0.Ha8jMv6pewZAka5NV4N8Tj6olp6LlsqYpJvcgUQW_1w";  // Replace with your actual Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle sign-in
async function signIn(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Sign-in error:", error.message);
  } else {
    console.log("Signed in user:", user);
  }
}

// Function to handle sign-up
async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Sign-up error:", error.message);
  } else {
    console.log("Signed up user:", user);
  }
}

// Function to log out
async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Log-out error:", error.message);
  } else {
    console.log("User logged out.");
  }
}

// Function to check the current session
async function checkSession() {
  const session = supabase.auth.session();
  if (session) {
    console.log("Current session:", session);
  } else {
    console.log("No active session.");
  }
}
