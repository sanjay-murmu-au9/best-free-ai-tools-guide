import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StarIcon, HeartIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
const API_BASE_URL = 'https://digldzbwgoqnwuhpdjuw.supabase.co/functions/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ2xkemJ3Z29xbnd1aHBkanV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc1MjYsImV4cCI6MjA3NDY2MzUyNn0.qVYryQjm8fpvnrA8TMl6DrP_NQREx3vaD518LClY6J8';
import { Tool } from '../types';

import ToolOverview from '../components/ToolOverview';
import VideoEmbed from '../components/VideoEmbed';

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Tool not found');
        const result = await response.json();
        setTool(result.data);
      } catch (error) {
        console.error('Failed to fetch tool:', error);
        setTool(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading tool...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.floor(rating) ? (
          <StarIconSolid className="w-5 h-5 text-yellow-400" />
        ) : (
          <StarIcon className="w-5 h-5 text-gray-300" />
        )}
      </span>
    ));
  };

  const getGettingStartedSteps = () => {
    // Use data from API if available, otherwise fallback to default steps
    if (tool.getting_started_guide && tool.getting_started_guide.length > 0) {
      return tool.getting_started_guide;
    }
    // Default fallback steps
    return [
      {
        title: 'Sign up for an account',
        description: 'Create your account on the official website',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop'
      },
      {
        title: 'Explore the interface',
        description: 'Get familiar with the main features and navigation',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
      },
      {
        title: 'Start creating',
        description: 'Begin with simple projects to learn the basics',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop'
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg shadow-sm border flex items-center justify-center flex-shrink-0 overflow-hidden">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={`${tool.name} logo`}
                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center rounded-lg ${tool.logo_url ? 'hidden' : 'flex'}`}>
                  <span className="text-white font-bold text-lg sm:text-2xl">{tool.name.charAt(0)}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="flex">{renderStars(tool.rating)}</div>
                    <span className="text-sm text-gray-500">({tool.review_count} reviews)</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium w-fit">
                    {tool.category?.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <button className="p-2 text-gray-400 hover:text-red-500">
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Visit Website</span>
                <span className="sm:hidden">Visit</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 sm:ml-2" />
              </a>
            </div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{tool.description}</p>
        </div>

        {/* Tool Overview */}
        <ToolOverview tool={tool} />

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-8 lg:p-10 mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-8">Getting Started Guide</h2>
          <div className="space-y-8 md:space-y-10">
            {getGettingStartedSteps().map((step, index) => (
              <div key={index} className="">
                {/* Mobile Layout */}
                <div className="block md:hidden">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{step.title}</h3>
                  </div>
                  <div className="pl-0">
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">{step.description}</p>
                    {step.details && (
                      <ul className="text-sm text-gray-700 space-y-2 mb-5">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1 flex-shrink-0 text-sm">•</span>
                            <span className="break-words leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.image && (
                      <div className="mt-4 rounded-lg overflow-hidden border">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-32 object-cover bg-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                        <div className="hidden bg-gray-100 h-32 items-center justify-center text-gray-500">
                          <div className="text-center">
                            <div className="text-3xl mb-2">📸</div>
                            <p className="text-sm">{step.title} Interface</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {step.tips && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800 leading-relaxed">
                          <span className="font-semibold">💡 Pro Tip:</span> {step.tips}
                        </p>
                      </div>
                    )}
                    {step.video && (
                      <div className="mt-4">
                        <VideoEmbed 
                          title={`${tool.name} - ${step.title}`}
                          videoId={step.video}
                          placeholder={`Watch how to ${step.title.toLowerCase()}`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{step.title}</h3>
                    <p className="text-xl text-gray-700 mb-6 leading-relaxed">{step.description}</p>
                    {step.details && (
                      <ul className="text-lg text-gray-700 space-y-4 mb-6">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <span className="text-blue-600 mt-2 flex-shrink-0 text-lg">•</span>
                            <span className="break-words leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.image && (
                      <div className="mt-6 rounded-lg overflow-hidden border">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-56 object-cover bg-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                        <div className="hidden bg-gray-100 h-56 items-center justify-center text-gray-500">
                          <div className="text-center">
                            <div className="text-5xl mb-3">📸</div>
                            <p className="text-xl">{step.title} Interface</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {step.tips && (
                      <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-lg text-blue-800 leading-relaxed">
                          <span className="font-semibold">💡 Pro Tip:</span> {step.tips}
                        </p>
                      </div>
                    )}
                    {step.video && (
                      <div className="mt-6">
                        <VideoEmbed 
                          title={`${tool.name} - ${step.title}`}
                          videoId={step.video}
                          placeholder={`Watch how to ${step.title.toLowerCase()}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Plan</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Basic features</li>
                <li>• Limited usage</li>
                <li>• Community support</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Popular</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Plan</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">$20<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All features</li>
                <li>• Unlimited usage</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews - Temporarily disabled */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
          <p className="text-gray-500">Reviews feature coming soon!</p>
        </div>
      </div>
    </div>
  );
}