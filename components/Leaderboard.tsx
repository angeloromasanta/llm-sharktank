import React from 'react';
import { Award, ThumbsUp, ThumbsDown } from 'lucide-react';

const Leaderboard = () => {
  // LLM Models with their colors and stats
  const llmModels = [
    {
      id: 'anthropic/claude-3.7-sonnet',
      name: 'Claude 3.7 Sonnet',
      short: 'Claude',
      color: '#6366f1',
      stats: {
        acceptRate: 62,
        totalReviews: 74,
        uniqueInsights: 89,
        avgSentiment: 76,
      },
    },
    {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      short: 'GPT-4o',
      color: '#10b981',
      stats: {
        acceptRate: 58,
        totalReviews: 82,
        uniqueInsights: 81,
        avgSentiment: 72,
      },
    },
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      name: 'Llama 3.3 70B Instruct',
      short: 'Llama',
      color: '#4f46e5',
      stats: {
        acceptRate: 51,
        totalReviews: 67,
        uniqueInsights: 75,
        avgSentiment: 69,
      },
    },
    {
      id: 'mistralai/mistral-nemo',
      name: 'Mistral Nemo',
      short: 'Mistral',
      color: '#8b5cf6',
      stats: {
        acceptRate: 49,
        totalReviews: 59,
        uniqueInsights: 72,
        avgSentiment: 65,
      },
    },
    {
      id: 'google/gemini-2.0-flash-001',
      name: 'Gemini 2.0 Flash',
      short: 'Gemini',
      color: '#0ea5e9',
      stats: {
        acceptRate: 53,
        totalReviews: 71,
        uniqueInsights: 77,
        avgSentiment: 68,
      },
    },
    {
      id: 'deepseek/deepseek-chat',
      name: 'DeepSeek Chat',
      short: 'DeepSeek',
      color: '#f59e0b',
      stats: {
        acceptRate: 47,
        totalReviews: 56,
        uniqueInsights: 69,
        avgSentiment: 63,
      },
    },
  ];

  // Sort models by accept rate descending
  const sortedModels = [...llmModels].sort(
    (a, b) => b.stats.acceptRate - a.stats.acceptRate
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Award className="mr-2 text-blue-600" size={20} />
          LLM Model Performance Rankings
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accept Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Reviews
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unique Insights
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Sentiment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedModels.map((model, index) => (
              <tr
                key={model.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                      style={{ backgroundColor: model.color }}
                    >
                      {model.short.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-500">{model.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`mr-2 ${
                        model.stats.acceptRate > 55
                          ? 'text-green-600'
                          : model.stats.acceptRate < 50
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {model.stats.acceptRate > 55 ? (
                        <ThumbsUp size={16} />
                      ) : model.stats.acceptRate < 50 ? (
                        <ThumbsDown size={16} />
                      ) : (
                        <ThumbsUp size={16} />
                      )}
                    </div>
                    <span className="text-sm text-gray-900">
                      {model.stats.acceptRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.stats.totalReviews}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.stats.uniqueInsights}/100
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${model.stats.avgSentiment}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {model.stats.avgSentiment}/100
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
