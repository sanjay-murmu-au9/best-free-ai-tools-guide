import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addVideoTools() {
  try {
    console.log('🎬 Adding AI video editing tools...');

    // Get Video Editing category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'video-editing')
      .single();

    if (!category) {
      console.error('Video editing category not found');
      return;
    }

    const videoTools = [
      {
        name: 'Runway ML',
        description: 'Runway ML is a cutting-edge AI video editing platform that empowers creators with advanced machine learning tools. Generate videos from text, remove backgrounds, create slow-motion effects, and apply AI-powered filters to transform your content.',
        category_id: category.id,
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
      },
      {
        name: 'Synthesia',
        description: 'Synthesia is the leading AI video generation platform that creates professional videos with AI avatars. Perfect for training videos, marketing content, and presentations without needing cameras, microphones, or actors.',
        category_id: category.id,
        website_url: 'https://synthesia.io',
        pricing: 'Paid',
        features: [
          'AI avatar video generation',
          '120+ AI avatars',
          '120+ languages and voices',
          'Custom avatar creation',
          'Screen recording',
          'Video templates'
        ],
        logo_url: 'https://via.placeholder.com/64x64/6366f1/ffffff?text=S',
        rating: 4.7,
        review_count: 1200,
        getting_started_guide: [
          {
            title: 'Step 1: Create your first AI avatar video (10 minutes)',
            description: '📖 Story: Meet David, an HR manager who needs to create training videos quickly.',
            details: [
              '🌟 David\'s Challenge: "I need to create 20 training videos but don\'t have time for filming!"',
              '1. David signs up at synthesia.io with his work email',
              '2. He chooses from 120+ professional AI avatars',
              '3. "Perfect! This avatar looks professional for our company training"',
              '4. David types his script: "Welcome to our new employee onboarding program..."',
              '5. He selects English voice with Indian accent',
              '6. Adds company logo and branding colors',
              '7. Clicks "Generate" and gets a professional video in 10 minutes!'
            ],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
            tips: '💡 David\'s Tip: "Use the same avatar across all videos for brand consistency!"'
          }
        ],
        use_cases: [
          'Corporate training videos',
          'Product demonstrations',
          'Educational content',
          'Marketing presentations',
          'Multilingual content',
          'Internal communications'
        ],
        best_for: [
          'Corporate trainers',
          'Marketing teams',
          'Educational institutions',
          'HR departments',
          'Product managers',
          'International businesses'
        ],
        pros: [
          'No filming or equipment needed',
          'Professional AI avatars',
          'Multiple languages supported',
          'Quick video generation',
          'Consistent quality'
        ],
        cons: [
          'Subscription required',
          'Limited customization of avatars',
          'Can look artificial to some viewers',
          'No free tier',
          'Processing time for longer videos'
        ]
      },
      {
        name: 'Pictory',
        description: 'Pictory transforms long-form content into engaging short videos automatically. Perfect for creating social media content, video summaries, and promotional videos from blog posts, articles, or scripts.',
        category_id: category.id,
        website_url: 'https://pictory.ai',
        pricing: 'Freemium',
        features: [
          'Script to video conversion',
          'Blog post to video',
          'Auto video highlights',
          'AI voiceovers',
          'Stock media library',
          'Brand customization'
        ],
        logo_url: 'https://via.placeholder.com/64x64/10b981/ffffff?text=P',
        rating: 4.5,
        review_count: 950,
        getting_started_guide: [
          {
            title: 'Step 1: Transform your first blog post into video (15 minutes)',
            description: '📖 Story: Meet Priya, a blogger who wants to repurpose her content for social media.',
            details: [
              '🌟 Priya\'s Goal: "I have 50 blog posts but no time to create videos for each one!"',
              '1. Priya signs up at pictory.ai and gets 3 free videos',
              '2. She clicks "Article to Video" and pastes her blog URL',
              '3. "Amazing! AI is reading my entire article and creating scenes"',
              '4. Pictory automatically selects key points and creates video scenes',
              '5. She customizes with her brand colors and logo',
              '6. Adds background music from the built-in library',
              '7. Downloads a 2-minute video perfect for Instagram and LinkedIn!'
            ],
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
            tips: '💡 Priya\'s Tip: "Use the same template for all videos to maintain brand consistency!"'
          }
        ],
        use_cases: [
          'Blog post to video conversion',
          'Social media content',
          'Video summaries',
          'Educational content',
          'Marketing videos',
          'Content repurposing'
        ],
        best_for: [
          'Content creators and bloggers',
          'Social media managers',
          'Digital marketers',
          'Educators and trainers',
          'Small business owners',
          'Content agencies'
        ],
        pros: [
          'Easy content repurposing',
          'Free tier available',
          'Automatic scene creation',
          'Large stock media library',
          'Quick video generation'
        ],
        cons: [
          'Limited customization in free tier',
          'Watermark on free videos',
          'May need manual editing for best results',
          'Limited video length in free plan',
          'Stock footage can be generic'
        ]
      }
    ];

    // Insert all video tools
    const { error } = await supabase
      .from('tools')
      .insert(videoTools);

    if (error) {
      console.error('❌ Error adding tools:', error);
      return;
    }

    console.log('✅ Video editing tools added successfully!');
    console.log(`📊 Added ${videoTools.length} tools: ${videoTools.map(t => t.name).join(', ')}`);
  } catch (error) {
    console.error('❌ Failed to add video tools:', error);
  }
}

addVideoTools();