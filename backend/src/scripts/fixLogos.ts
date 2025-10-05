import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixLogos() {
  try {
    console.log('🔧 Fixing logo URLs...');

    // Update Midjourney logo - using a simple placeholder that works
    await supabase
      .from('tools')
      .update({ 
        logo_url: 'https://via.placeholder.com/64x64/6366f1/ffffff?text=MJ'
      })
      .eq('name', 'Midjourney');

    // Update Grammarly logo - using a simple placeholder that works
    await supabase
      .from('tools')
      .update({ 
        logo_url: 'https://via.placeholder.com/64x64/15803d/ffffff?text=G'
      })
      .eq('name', 'Grammarly');

    // Update Perplexity logo - using a simple placeholder that works
    await supabase
      .from('tools')
      .update({ 
        logo_url: 'https://via.placeholder.com/64x64/1e40af/ffffff?text=P'
      })
      .eq('name', 'Perplexity');

    console.log('✅ Logo URLs updated successfully!');
  } catch (error) {
    console.error('❌ Failed to update logos:', error);
  }
}

fixLogos();