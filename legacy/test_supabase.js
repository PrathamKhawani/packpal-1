
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://koslnldqdbcikqevgjaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvc2xubGRxZGJjaWtxZXZnamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDQ3NjYsImV4cCI6MjA5MjAyMDc2Nn0.ThE2lqsMbGxirrmPUMjlxOxx3IditRUR13td5PxmeIU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('checklist_items').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success! Data:', data);
    }
}

test();
