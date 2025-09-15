"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Target, Eye, Heart } from 'lucide-react';

interface CampaignAnalyticsProps {
  className?: string;
}

export function CampaignAnalytics({ className = "" }: CampaignAnalyticsProps) {
  // Mock data - in real app this would come from your analytics service
  // Note: analyticsData reserved for future detailed metrics implementation

  const performanceMetrics = [
    {
      label: "Total Reach",
      value: "127K",
      change: "+15.2%",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      label: "Engagement Rate",
      value: "8.3%",
      change: "+2.1%",
      icon: Heart,
      color: "text-red-600"
    },
    {
      label: "Applications",
      value: "24",
      change: "+6",
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Campaign Score",
      value: "4.7/5",
      change: "+0.3",
      icon: Target,
      color: "text-primary"
    }
  ];

  const campaignPerformance = [
    { name: "TechFlow App Launch", reach: 45000, engagement: 9.2, status: "completed" },
    { name: "Eco Campus Challenge", reach: 32000, engagement: 7.8, status: "active" },
    { name: "Study Abroad Stories", reach: 28000, engagement: 8.9, status: "active" },
    { name: "Fashion Forward", reach: 22000, engagement: 6.5, status: "completed" }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <IconComponent className={`w-4 h-4 mr-2 ${metric.color}`} />
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-dark">{metric.value}</div>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignPerformance.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-dark">{campaign.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      Reach: {campaign.reach.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Engagement: {campaign.engagement}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {campaign.status}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${campaign.engagement * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Week</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Month</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}