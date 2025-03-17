'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowRightLeft,
  MessageSquare,
  ThumbsDown,
  Award,
  Users,
} from 'lucide-react';

const SharkTank = ({ productData }) => {
  const [activeRound, setActiveRound] = useState(1);
  const [activeTab, setActiveTab] = useState('discussion');

  // LLM Models with their colors
  const llmModels = {
    'meta-llama/llama-3.3-70b-instruct': { color: '#4f46e5', short: 'Llama' },
    'google/gemini-2.0-flash-001': { color: '#0ea5e9', short: 'Gemini' },
    'mistralai/mistral-nemo': { color: '#8b5cf6', short: 'Mistral' },
    'openai/gpt-4o-mini': { color: '#10b981', short: 'GPT-4o' },
    'deepseek/deepseek-chat': { color: '#f59e0b', short: 'DeepSeek' },
    'anthropic/claude-3.7-sonnet': { color: '#6366f1', short: 'Claude' },
  };

  // Mock data for rounds
  const roundsData = [
    {
      number: 1,
      activeMembers: [
        'Member 1',
        'Member 2',
        'Member 3',
        'Member 4',
        'Member 5',
        'Member 6',
      ],
      discussion: [
        {
          member: 'Member 1',
          model: 'meta-llama/llama-3.3-70b-instruct',
          content:
            "This product shows promise in the growing market intelligence sector. The ability to predict market shifts could provide significant value to businesses of all sizes. However, I'm concerned about data accuracy and how the algorithm handles conflicting signals.",
        },
        {
          member: 'Member 2',
          model: 'google/gemini-2.0-flash-001',
          content:
            'I like the concept, but the valuation seems high for a pre-revenue company. What validation metrics do you have beyond your beta testers? How are you addressing potential issues with data privacy regulations?',
        },
        {
          member: 'Member 3',
          model: 'mistralai/mistral-nemo',
          content:
            'The market for predictive analytics tools is getting crowded. I need to understand your unique advantage over established competitors. Your technology needs to be genuinely innovative to justify this valuation.',
        },
        {
          member: 'Member 4',
          model: 'openai/gpt-4o-mini',
          content:
            "The problem you're solving is real and valuable. Companies struggle to synthesize market signals effectively. But your customer acquisition strategy isn't clear, and I worry about the long sales cycles in enterprise software.",
        },
        {
          member: 'Member 5',
          model: 'deepseek/deepseek-chat',
          content:
            "I believe your product addresses a significant pain point for businesses. However, I'd like to see more evidence of accuracy in your predictions and a clearer path to profitability.",
        },
        {
          member: 'Member 6',
          model: 'anthropic/claude-3.7-sonnet',
          content:
            "This could be revolutionary if the predictive capabilities are as strong as you claim. My main concerns are about scalability and whether you've tested this across diverse markets and industries to ensure broad applicability.",
        },
      ],
      eliminated: 'Member 4',
      votes: {
        'Member 1': 'Member 4',
        'Member 2': 'Member 1',
        'Member 3': 'Member 2',
        'Member 4': 'Member 2',
        'Member 5': 'Member 4',
        'Member 6': 'Member 5',
      },
    },
    {
      number: 2,
      activeMembers: [
        'Member 1',
        'Member 2',
        'Member 3',
        'Member 5',
        'Member 6',
      ],
      discussion: [
        {
          member: 'Member 5',
          model: 'deepseek/deepseek-chat',
          content:
            "After hearing more about your technology, I'm impressed with your approach to combining multiple data sources. Could you elaborate on how you're measuring the accuracy of your predictions?",
        },
        {
          member: 'Member 2',
          model: 'google/gemini-2.0-flash-001',
          content:
            "I'm still concerned about the valuation. What are your current revenue projections and customer acquisition costs? Have you considered a freemium model to accelerate adoption?",
        },
        {
          member: 'Member 3',
          model: 'mistralai/mistral-nemo',
          content:
            "Your competitive analysis seems incomplete. There are several established players offering similar services. What's your strategy for differentiation beyond just technical capabilities?",
        },
        {
          member: 'Member 6',
          model: 'anthropic/claude-3.7-sonnet',
          content:
            "I'm interested in your team composition. Do you have the right mix of AI expertise and industry knowledge? The success of this product will depend heavily on understanding both the technology and market dynamics.",
        },
        {
          member: 'Member 1',
          model: 'meta-llama/llama-3.3-70b-instruct',
          content:
            "Let's discuss scalability. How does your system handle increasing data volumes and new markets? I'm particularly concerned about maintaining prediction quality as you expand to different industries.",
        },
      ],
      eliminated: 'Member 5',
      votes: {
        'Member 1': 'Member 5',
        'Member 2': 'Member 5',
        'Member 3': 'Member 1',
        'Member 5': 'Member 6',
        'Member 6': 'Member 5',
      },
    },
    {
      number: 3,
      activeMembers: ['Member 1', 'Member 2', 'Member 3', 'Member 6'],
      discussion: [
        {
          member: 'Member 6',
          model: 'anthropic/claude-3.7-sonnet',
          content:
            "After three rounds of discussion, I'm convinced that your product has significant potential. My remaining concern is about your go-to-market strategy. How will you penetrate enterprise accounts with typically long sales cycles?",
        },
        {
          member: 'Member 1',
          model: 'meta-llama/llama-3.3-70b-instruct',
          content:
            "I'm interested in your data sources and how you're ensuring both breadth and depth in your analysis. Also, how are you handling potential biases in the training data for your prediction algorithms?",
        },
        {
          member: 'Member 3',
          model: 'mistralai/mistral-nemo',
          content:
            "Let's talk about your defensive moat. Once you prove this concept works, what prevents larger competitors from replicating your approach? Do you have any proprietary technology or data that gives you a sustainable advantage?",
        },
        {
          member: 'Member 2',
          model: 'google/gemini-2.0-flash-001',
          content:
            "I'm focused on unit economics. What's the cost to serve each customer, and how does that scale? Are there opportunities for additional revenue streams beyond the core subscription?",
        },
      ],
      eliminated: 'Member 3',
      votes: {
        'Member 1': 'Member 2',
        'Member 2': 'Member 3',
        'Member 3': 'Member 2',
        'Member 6': 'Member 3',
      },
    },
    {
      number: 4,
      activeMembers: ['Member 1', 'Member 2', 'Member 6'],
      discussion: [
        {
          member: 'Member 2',
          model: 'google/gemini-2.0-flash-001',
          content:
            'After thorough consideration, I believe this product has potential but the current valuation is too high and the competitive landscape is challenging.',
        },
        {
          member: 'Member 1',
          model: 'meta-llama/llama-3.3-70b-instruct',
          content:
            'I see tremendous potential in this market intelligence tool. The technical approach is sound, and with the right execution, this could transform how businesses make strategic decisions.',
        },
        {
          member: 'Member 6',
          model: 'anthropic/claude-3.7-sonnet',
          content:
            'This product addresses a clear market need with an innovative approach. While there are execution risks, I believe the team has the right expertise and vision to succeed.',
        },
      ],
      finalVotes: {
        'Member 2': 'Out',
        'Member 1': 'In',
        'Member 6': 'In',
      },
      result: 'In',
    },
  ];

  // Helper function to get the current round data
  const getCurrentRound = () => {
    return (
      roundsData.find((round) => round.number === activeRound) || roundsData[0]
    );
  };

  // Get current round data
  const currentRound = getCurrentRound();

  // Rendering functions
  const renderTabs = () => (
    <div className="flex border-b mb-4">
      <button
        className={`px-4 py-2 font-medium ${
          activeTab === 'discussion'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600'
        }`}
        onClick={() => setActiveTab('discussion')}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span>Discussion</span>
        </div>
      </button>
      <button
        className={`px-4 py-2 font-medium ${
          activeTab === 'voting'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600'
        }`}
        onClick={() => setActiveTab('voting')}
      >
        <div className="flex items-center gap-2">
          <ThumbsDown size={16} />
          <span>Elimination Voting</span>
        </div>
      </button>
      {currentRound.number === 4 && (
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'result'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('result')}
        >
          <div className="flex items-center gap-2">
            <Award size={16} />
            <span>Final Decision</span>
          </div>
        </button>
      )}
    </div>
  );

  const renderMemberAvatar = (member, model) => {
    const modelInfo = llmModels[model];

    return (
      <div className="flex items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold shadow-sm"
          style={{ backgroundColor: modelInfo?.color || '#CCCCCC' }}
        >
          {modelInfo?.short?.charAt(0) || 'L'}
        </div>
        <div>
          <div className="font-medium">{member}</div>
          <div className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 inline-block mt-1">
            {modelInfo?.short}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to determine opinion stance
  const getOpinionStance = (content) => {
    const lowerContent = content.toLowerCase();

    // Simplistic sentiment analysis - this could be more sophisticated
    if (
      lowerContent.includes('potential') &&
      !lowerContent.includes('concerned') &&
      !lowerContent.includes('however')
    ) {
      return 'pro';
    } else if (
      lowerContent.includes('concerned') ||
      lowerContent.includes('worried') ||
      lowerContent.includes('unclear') ||
      lowerContent.includes('too high')
    ) {
      return 'against';
    } else {
      return 'neutral';
    }
  };

  const renderDiscussion = () => {
    // Group messages by stance
    const proMessages = currentRound.discussion.filter(
      (msg) => getOpinionStance(msg.content) === 'pro'
    );
    const neutralMessages = currentRound.discussion.filter(
      (msg) => getOpinionStance(msg.content) === 'neutral'
    );
    const againstMessages = currentRound.discussion.filter(
      (msg) => getOpinionStance(msg.content) === 'against'
    );

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pro Column */}
          <div className="space-y-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-800 font-medium flex items-center justify-center">
              <div className="bg-green-200 p-1 rounded-full mr-2">
                <ThumbsDown className="rotate-180 h-4 w-4 text-green-700" />
              </div>
              Pro ({proMessages.length})
            </div>
            {proMessages.map((message, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-400"
              >
                <div className="flex items-center mb-3">
                  {renderMemberAvatar(message.member, message.model)}
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>

          {/* Neutral Column */}
          <div className="space-y-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-800 font-medium flex items-center justify-center">
              <div className="bg-blue-200 p-1 rounded-full mr-2">
                <ArrowRightLeft className="h-4 w-4 text-blue-700" />
              </div>
              Neutral ({neutralMessages.length})
            </div>
            {neutralMessages.map((message, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-400"
              >
                <div className="flex items-center mb-3">
                  {renderMemberAvatar(message.member, message.model)}
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>

          {/* Against Column */}
          <div className="space-y-4">
            <div className="bg-red-100 p-3 rounded-lg text-red-800 font-medium flex items-center justify-center">
              <div className="bg-red-200 p-1 rounded-full mr-2">
                <ThumbsDown className="h-4 w-4 text-red-700" />
              </div>
              Against ({againstMessages.length})
            </div>
            {againstMessages.map((message, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-400"
              >
                <div className="flex items-center mb-3">
                  {renderMemberAvatar(message.member, message.model)}
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderVoting = () => {
    if (!currentRound.votes) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-4">Elimination Votes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentRound.votes).map(
                ([voter, votedFor], index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-sm border transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white mr-3">
                          {voter.split(' ')[1]}
                        </div>
                        <div className="font-medium text-gray-700">{voter}</div>
                      </div>
                      <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full">
                        <span>Votes out:</span>
                        <span className="font-bold ml-1">{votedFor}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <ThumbsDown size={28} className="text-red-500" />
              </div>
              <h3 className="font-medium text-lg text-red-800 text-center">
                Eliminated This Round
              </h3>
              <div className="mt-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl font-bold mb-2">
                  {currentRound.eliminated.split(' ')[1]}
                </div>
                <span className="text-red-800 font-medium text-lg">
                  {currentRound.eliminated}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-4 text-center">
                Received the most elimination votes from other panel members
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFinalResult = () => {
    if (!currentRound.finalVotes) return null;

    const totalVotes = Object.values(currentRound.finalVotes);
    const inVotes = totalVotes.filter((vote) => vote === 'In').length;
    const outVotes = totalVotes.filter((vote) => vote === 'Out').length;

    // Group final votes by stance
    const proMembers = Object.entries(currentRound.finalVotes).filter(
      ([_, vote]) => vote === 'In'
    );
    const againstMembers = Object.entries(currentRound.finalVotes).filter(
      ([_, vote]) => vote === 'Out'
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pro Column */}
          <div className="space-y-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-800 font-medium flex items-center justify-center">
              <div className="bg-green-200 p-1 rounded-full mr-2">
                <ThumbsDown className="rotate-180 h-4 w-4 text-green-700" />
              </div>
              In Favor ({proMembers.length})
            </div>

            {proMembers.map(([member, _], index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-sm border border-green-200 bg-green-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-green-800">{member}</div>
                  <div className="bg-green-100 rounded-full px-3 py-1 text-sm text-green-800 font-medium">
                    Accepts
                  </div>
                </div>
                <div className="text-green-700">
                  "I believe this product has strong market potential and the
                  team demonstrates the expertise needed to succeed."
                </div>
              </div>
            ))}
          </div>

          {/* Center column - Final Decision */}
          <div>
            <div
              className={`h-full p-6 rounded-lg border flex flex-col items-center justify-center ${
                currentRound.result === 'In'
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <h2 className="text-xl font-medium mb-4 text-gray-800">
                Final Decision
              </h2>

              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                  currentRound.result === 'In' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <div
                  className={`text-4xl ${
                    currentRound.result === 'In'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {currentRound.result === 'In' ? '✓' : '✕'}
                </div>
              </div>

              <div
                className={`text-3xl font-bold mb-2 ${
                  currentRound.result === 'In'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {currentRound.result === 'In' ? 'ACCEPTED' : 'REJECTED'}
              </div>

              <div className="mt-2 text-gray-500 text-center">
                Vote split: {inVotes} to {outVotes}
              </div>

              <div className="mt-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-800 text-center">
                {currentRound.result === 'In'
                  ? 'The product will receive the requested investment and mentorship'
                  : 'The product will not receive investment from the panel'}
              </div>
            </div>
          </div>

          {/* Against Column */}
          <div className="space-y-4">
            <div className="bg-red-100 p-3 rounded-lg text-red-800 font-medium flex items-center justify-center">
              <div className="bg-red-200 p-1 rounded-full mr-2">
                <ThumbsDown className="h-4 w-4 text-red-700" />
              </div>
              Against ({againstMembers.length})
            </div>

            {againstMembers.map(([member, _], index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-sm border border-red-200 bg-red-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-red-800">{member}</div>
                  <div className="bg-red-100 rounded-full px-3 py-1 text-sm text-red-800 font-medium">
                    Rejects
                  </div>
                </div>
                <div className="text-red-700">
                  "The valuation is too high given the current market conditions
                  and competitive landscape."
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4">
        {/* Product Information */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-xs">
                <img
                  src={productData.imageUrl}
                  alt={productData.name}
                  className="rounded-lg w-full h-full object-cover shadow-lg"
                />
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  New Pitch
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-6 md:pl-8 flex flex-col justify-center">
              <div className="flex items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {productData.name}
                </h2>
                <div className="ml-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Tech Startup
                </div>
              </div>

              <div className="text-blue-600 font-medium mb-4 text-lg">
                {productData.askingFor}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {productData.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Users size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    {currentRound.activeMembers.length} LLMs Evaluating
                  </span>
                </div>

                <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <ChevronRight size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Round {currentRound.number}
                    {currentRound.number === 4 ? ' (Final)' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Round Navigation */}
        <div className="flex overflow-x-auto whitespace-nowrap py-2 mb-6">
          {roundsData.map((round) => (
            <button
              key={round.number}
              onClick={() => setActiveRound(round.number)}
              className={`px-4 py-2 rounded-full mr-2 flex items-center ${
                activeRound === round.number
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>Round {round.number}</span>
              {round.number === 4 && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Final
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Round Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {currentRound.number === 4
                ? 'Final Decision Round'
                : `Round ${currentRound.number}`}
            </h2>
            <div className="text-sm text-gray-500 flex items-center">
              <Users size={16} className="mr-1" />
              {currentRound.activeMembers.length} Active Members
            </div>
          </div>

          {renderTabs()}

          <div className="mt-6">
            {activeTab === 'discussion' && renderDiscussion()}
            {activeTab === 'voting' && renderVoting()}
            {activeTab === 'result' &&
              currentRound.number === 4 &&
              renderFinalResult()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharkTank;
