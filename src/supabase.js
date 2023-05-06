
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hrutybarskaiueqncuyo.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydXR5YmFyc2thaXVlcW5jdXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyNjg0NzcsImV4cCI6MTk5ODg0NDQ3N30.VTJIH6NzOKVj5eXODhp_f1jjFdX8W-zE2o7elYQHs0g";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;