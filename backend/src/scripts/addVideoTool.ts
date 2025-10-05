import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addVideoTool() {
  try {
    console.log('🎬 Adding video editing tool...');

    // Get Video Editing category ID
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'video-editing')
      .single();

    if (!categories) {
      console.error('Video editing category not found');
      return;
    }

    // Add Runway ML
    const { error } = await supabase
      .from('tools')
      .insert({
        name: 'Runway ML',
        description: 'Runway ML is a cutting-edge AI video editing platform that empowers creators with advanced machine learning tools. Generate videos from text, remove backgrounds, create slow-motion effects, and apply AI-powered filters to transform your content.',
        category_id: categories.id,
        website_url: 'https://runwayml.com',
        pricing: 'Freemium',
        features: [
          'Text-to-video generation',
          'AI background removal',
          'Real-time video effects',
          'Motion tracking',
          'Style transfer',
          'Green screen replacement'
        ],
        logo_url: 'https://via.placeholder.com/64x64/000000/ffffff?text=R',
        rating: 4.6,
        review_count: 850,
        getting_started_guide: [
          {
            title: 'Step 1: Sign up and explore the interface (5 minutes)',
            description: '📖 Story: Meet Sarah, a content creator who wants to add AI magic to her videos.',
            details: [
              '🌟 Sarah\'s Journey: "I want to create viral videos but editing takes forever. Let me try Runway ML!"',
              '1. Sarah visits runwayml.com and clicks "Sign Up"',
              '2. She creates account with her email: sarah.creator@gmail.com',
              '3. "Wow, so many AI tools!" - She sees the dashboard with various video tools',
              '4. Sarah clicks on "Text to Video" - "I can create videos from just text?"',
              '5. She explores other tools: Background Removal, Style Transfer, Motion Tracking',
              '6. "This is like having a whole video studio powered by AI!"'
            ],
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop',
            tips: '💡 Sarah\'s Tip: "Start with the free credits to test different tools before upgrading!"'
          }
        ],
        use_cases: [
          'Social media content creation',
          'Marketing video production',
          'Film and documentary editing',
          'Educational content',
          'Music video effects',
          'Corporate presentations'
        ],
        best_for: [
          'Content creators and influencers',
          'Video editors and filmmakers',
          'Marketing professionals',
          'Social media managers',
          'YouTubers and streamers',
          'Creative agencies'
        ],
        pros: [
          'Cutting-edge AI technology',
          'User-friendly interface',
          'Wide range of AI tools',
          'High-quality output',
          'Regular feature updates'
        ],
        cons: [
          'Can be expensive for heavy usage',
          'Learning curve for advanced features',
          'Requires good internet connection',
          'Limited free tier',
          'Processing can be slow for complex videos'
        ]
      });

    if (error) {
      console.error('❌ Error adding tool:', error);
      return;
    }

    console.log('✅ Runway ML added successfully!');
  } catch (error) {
    console.error('❌ Failed to add video tool:', error);
  }
}

addVideoTool();