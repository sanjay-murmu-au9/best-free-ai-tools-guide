import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addToolColumns() {
  try {
    console.log('🔧 Adding columns to tools table...');

    // Add columns using SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tools 
        ADD COLUMN IF NOT EXISTS getting_started_guide JSONB,
        ADD COLUMN IF NOT EXISTS use_cases TEXT[],
        ADD COLUMN IF NOT EXISTS best_for TEXT[],
        ADD COLUMN IF NOT EXISTS pros TEXT[],
        ADD COLUMN IF NOT EXISTS cons TEXT[];
      `
    });

    if (error) {
      console.error('❌ Error adding columns:', error);
      return;
    }

    console.log('✅ Columns added successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

addToolColumns();