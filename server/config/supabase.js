const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// We use the SECRET key because this backend needs privilege to bypass RLS and create users 
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase configuration. Supabase auth will fail.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
