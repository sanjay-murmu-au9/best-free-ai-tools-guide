import { Tool } from '../types';

interface ToolOverviewProps {
  tool: Tool;
}

export default function ToolOverview({ tool }: ToolOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About {tool.name}</h2>
      
      <div className="prose max-w-none">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">What is {tool.name} used for?</h3>
          <div className="space-y-2 sm:space-y-3">
            {getUseCases(tool.name).map((useCase, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">{useCase}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Who should use {tool.name}?</h3>
          <div className="space-y-2 sm:space-y-3">
            {getBestFor(tool.name).map((audience, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-3 sm:mb-4">Pros</h3>
          <div className="space-y-2">
            {getPros(tool.name).map((pro, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">+</span>
                <p className="text-sm sm:text-base text-gray-700">{pro}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-red-700 mb-3 sm:mb-4">Cons</h3>
          <div className="space-y-2">
            {getCons(tool.name).map((con, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-red-600 font-bold">-</span>
                <p className="text-sm sm:text-base text-gray-700">{con}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getUseCases(toolName: string): string[] {
  const useCases: Record<string, string[]> = {
    'ChatGPT': [
      'Content creation and copywriting',
      'Code generation and debugging',
      'Research and data analysis',
      'Customer service automation',
      'Educational tutoring and explanations',
      'Creative writing and brainstorming'
    ],
    'Midjourney': [
      'Marketing and advertising visuals',
      'Concept art and design prototyping',
      'Social media content creation',
      'Book covers and illustrations',
      'Website and app design mockups',
      'Personal art projects and exploration'
    ],
    'GitHub Copilot': [
      'Accelerating software development',
      'Learning new programming languages',
      'Code documentation and comments',
      'Bug fixing and optimization',
      'API integration and boilerplate code',
      'Test case generation'
    ],
    'Perplexity': [
      'Research and fact-checking',
      'Getting current news and updates',
      'Academic paper research',
      'Market analysis and trends',
      'Technical documentation lookup',
      'Comparative analysis of topics'
    ]
  };
  return useCases[toolName] || ['General productivity and efficiency', 'Creative projects', 'Professional work'];
}

function getBestFor(toolName: string): string[] {
  const audiences: Record<string, string[]> = {
    'ChatGPT': [
      'Content creators and marketers',
      'Software developers and programmers',
      'Students and researchers',
      'Business professionals',
      'Writers and journalists',
      'Entrepreneurs and consultants'
    ],
    'Midjourney': [
      'Graphic designers and artists',
      'Marketing professionals',
      'Content creators and influencers',
      'Game developers and concept artists',
      'Small business owners',
      'Creative hobbyists'
    ],
    'GitHub Copilot': [
      'Software developers (all levels)',
      'Computer science students',
      'DevOps engineers',
      'Technical leads and architects',
      'Freelance programmers',
      'Open source contributors'
    ],
    'Perplexity': [
      'Researchers and academics',
      'Students and learners',
      'Journalists and writers',
      'Business analysts',
      'Fact-checkers',
      'Curious individuals seeking reliable information'
    ]
  };
  return audiences[toolName] || ['Creative professionals', 'Business users', 'Students and learners'];
}

function getPros(toolName: string): string[] {
  const pros: Record<string, string[]> = {
    'ChatGPT': [
      'Incredibly versatile and knowledgeable',
      'Available 24/7 with instant responses',
      'Continuously improving with updates',
      'Free tier available for basic use',
      'Excellent at understanding context'
    ],
    'Midjourney': [
      'Exceptional image quality and detail',
      'Strong artistic style understanding',
      'Active community and inspiration',
      'Regular model improvements',
      'Commercial usage rights included'
    ],
    'GitHub Copilot': [
      'Significant productivity boost',
      'Supports many programming languages',
      'Learns from your coding style',
      'Excellent IDE integration',
      'Helpful for learning new frameworks'
    ],
    'Perplexity': [
      'Real-time, up-to-date information',
      'Provides source citations for verification',
      'Excellent for research and fact-checking',
      'Clean, ad-free search experience',
      'Handles complex, multi-part questions well'
    ]
  };
  return pros[toolName] || ['User-friendly interface', 'Good performance', 'Regular updates'];
}

function getCons(toolName: string): string[] {
  const cons: Record<string, string[]> = {
    'ChatGPT': [
      'Can sometimes provide inaccurate information',
      'Limited knowledge cutoff date',
      'Usage limits on free tier',
      'May struggle with very recent events',
      'Requires careful prompt engineering'
    ],
    'Midjourney': [
      'Subscription required for full access',
      'Limited control over specific details',
      'Can be inconsistent with text in images',
      'Requires Discord for access',
      'Queue times during peak usage'
    ],
    'GitHub Copilot': [
      'Subscription cost for individuals',
      'May suggest suboptimal code patterns',
      'Potential security and licensing concerns',
      'Can create dependency on AI assistance',
      'Not always context-aware'
    ],
    'Perplexity': [
      'Limited free queries per day',
      'May not have access to very recent information',
      'Can be slower than traditional search engines',
      'Premium features require subscription',
      'May struggle with very niche or specialized topics'
    ]
  };
  return cons[toolName] || ['Learning curve for new users', 'Pricing may be high for some', 'Limited customization'];
}