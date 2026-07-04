// ===================================================
// Klaso — Supabase connection
// This one file connects every page to your real database.
// ===================================================

const SUPABASE_URL = 'https://osyjszxdwktlxfqlcqgv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeWpzenhkd2t0bHhmcWxjcWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjU3OTEsImV4cCI6MjA5ODUwMTc5MX0.EAVwSM4AriZo4xD_XZWmgY8OXewP-ouMoleUMlDorXY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);