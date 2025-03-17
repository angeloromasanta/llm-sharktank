// components/SharkTank.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getProductRounds } from '../lib/firebase';
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
  const [roundsData, setRoundsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // LLM Models with their colors
  const llmModels = {
    'meta-llama/llama-3.3-70b-instruct': { color: '#4f46e5', short: 'Llama' },
    'google/gemini-2.0-flash-001': { color: '#0ea5e9', short: 'Gemini' },
    'mistralai/mistral-nemo': { color: '#8b5cf6', short: 'Mistral' },
    'openai/gpt-4o-mini': { color: '#10b981', short: 'GPT-4o' },
    'deepseek/deepseek-chat': { color: '#f59e0b', short: 'DeepSeek' },
    'anthropic/claude-3.7-sonnet': { color: '#6366f1', short: 'Claude' },
  };

  // Fetch round data
 // Replace the useEffect in SharkTank.tsx with this updated version

// Replace the entire useEffect in SharkTank.tsx

useEffect(() => {
  const fetchCurrentRound = async () => {
    if (!productData?.id || !activeRound) return;
    
    try {
      console.log(`Directly fetching data for round ${activeRound}`);
      const rounds = await getProductRounds(productData.id);
      const round = rounds.find(r => r.number === activeRound);
      
      if (round) {
        console.log(`Direct fetch got round ${activeRound}:`, round);
        console.log(`Round has ${round.discussion ? round.discussion.length : 0} messages`);
        
        // Update just the current round without affecting others
        setRoundsData(prevRounds => {
          // Replace the current round in the array
          return prevRounds.map(r => 
            r.number === activeRound ? round : r
          );
        });
      }
    } catch (error) {
      console.error("Error fetching specific round:", error);
    }
  };
  
  fetchCurrentRound();
}, [productData?.id, activeRound]);

  // Helper function to get the current round data
  const getCurrentRound = () => {
    if (!roundsData || roundsData.length === 0) {
      return null;
    }
    
    console.log(`Looking for round ${activeRound} in ${roundsData.length} rounds`);
    
    // Find round with the matching number
    const foundRound = roundsData.find((round) => round.number === activeRound);
    
    if (foundRound) {
      console.log(`Found round ${activeRound}:`, foundRound);
      return foundRound;
    }
    
    // If not found, return the first round as fallback
    console.log(`Round ${activeRound} not found, falling back to first round`);
    return roundsData[0];
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
      {currentRound?.number === roundsData.length && roundsData.length > 0 && (
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
  const getOpinionStance = (content, position) => {
    // If the position is explicitly provided, use it
    if (position === 'pro' || position === 'against' || position === 'neutral') {
      return position;
    }
    
    // If content is empty, default to neutral
    if (!content) {
      return 'neutral';
    }
    
    const lowerContent = content.toLowerCase();
  
    // Simple content-based classification
    if (lowerContent.includes('great opportunity') || 
        lowerContent.includes('position: pro') ||
        (lowerContent.includes('potential') && !lowerContent.includes('concerns'))) {
      return 'pro';
    } else if (lowerContent.includes('concerns') || 
               lowerContent.includes('position: against') ||
               lowerContent.includes('worried') || 
               lowerContent.includes('too high')) {
      return 'against';
    } else {
      return 'neutral';
    }
  };

  // Replace the renderDiscussion function in SharkTank.tsx

// Replace the entire renderDiscussion function in SharkTank.tsx

const renderDiscussion = () => {
  if (!currentRound) {
    return <div className="p-6 text-center text-gray-500">No discussion data available yet.</div>;
  }

  console.log("Rendering discussion for round:", currentRound.number);
  console.log("Discussion data:", currentRound.discussion);
  
  // Ensure discussion is always an array
  const discussionArray = currentRound.discussion || [];
  console.log(`Found ${discussionArray.length} messages in round ${currentRound.number}`);
  
  // Group messages by stance
  const proMessages = discussionArray.filter(
    (msg) => getOpinionStance(msg.content, msg.position) === 'pro'
  );
  
  const neutralMessages = discussionArray.filter(
    (msg) => getOpinionStance(msg.content, msg.position) === 'neutral'
  );
  
  const againstMessages = discussionArray.filter(
    (msg) => getOpinionStance(msg.content, msg.position) === 'against'
  );
  
  console.log(`Pro: ${proMessages.length}, Neutral: ${neutralMessages.length}, Against: ${againstMessages.length}`);

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
              key={`pro-${message.member}-${index}`}
              className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-400"
            >
              <div className="flex items-center mb-3">
                {renderMemberAvatar(message.member, message.model)}
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
          {proMessages.length === 0 && (
            <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">
              No pro arguments in this round
            </div>
          )}
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
              key={`neutral-${message.member}-${index}`}
              className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-400"
            >
              <div className="flex items-center mb-3">
                {renderMemberAvatar(message.member, message.model)}
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
          {neutralMessages.length === 0 && (
            <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">
              No neutral arguments in this round
            </div>
          )}
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
              key={`against-${message.member}-${index}`}
              className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-400"
            >
              <div className="flex items-center mb-3">
                {renderMemberAvatar(message.member, message.model)}
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
          {againstMessages.length === 0 && (
            <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500">
              No counterarguments in this round
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  const renderVoting = () => {
    if (!currentRound || !currentRound.votes) {
      return <div className="p-6 text-center text-gray-500">No voting data available yet.</div>;
    }

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
              {Object.keys(currentRound.votes).length === 0 && (
                <div className="p-4 bg-white rounded-lg shadow-sm text-center text-gray-500 md:col-span-2">
                  Voting in progress...
                </div>
              )}
            </div>
          </div>

          <div>
            {currentRound.eliminated ? (
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
            ) : (
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-700"></div>
                </div>
                <h3 className="font-medium text-lg text-yellow-800 text-center">
                  Elimination in Progress
                </h3>
                <div className="text-sm text-gray-500 mt-4 text-center">
                  The panel is currently voting on who to eliminate
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFinalResult = () => {
    if (!currentRound || !currentRound.finalVotes) {
      return <div className="p-6 text-center text-gray-500">Final decision not available yet.</div>;
    }

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
            
            {proMembers.length === 0 && (
              <div className="p-6 rounded-lg shadow-sm text-center text-gray-500">
                No investors in favor yet
              </div>
            )}
          </div>

          {/* Center column - Final Decision */}
          <div>
            <div
              className={`h-full p-6 rounded-lg border flex flex-col items-center justify-center ${
                currentRound.result
                  ? currentRound.result === 'In'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <h2 className="text-xl font-medium mb-4 text-gray-800">
                Final Decision
              </h2>

              {currentRound.result ? (
                <>
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
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
                  <p className="text-gray-600">Finalizing decision...</p>
                </div>
              )}
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
            
            {againstMembers.length === 0 && (
              <div className="p-6 rounded-lg shadow-sm text-center text-gray-500">
                No investors against yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Replace the loading and empty states in SharkTank.tsx

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
      <p className="text-gray-600">Loading discussion data...</p>
    </div>
  );
}

// Changed this condition - don't require rounds data if product exists
if (!productData) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 rounded-lg">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <MessageSquare size={28} className="text-red-600" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        Product Not Found
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        The product information could not be loaded. Please check the product ID and try again.
      </p>
    </div>
  );
}
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4">
        {/* Product Information */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-xs">
                <img
                  src={productData.imageUrl || '/api/placeholder/400/300'}
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
                    {currentRound && currentRound.activeMembers ? currentRound.activeMembers.length : '?'} LLMs Evaluating
                  </span>
                </div>

                <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                  <ChevronRight size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Round {currentRound ? currentRound.number : '?'}
                    {currentRound && currentRound.number === roundsData.length ? ' (Final)' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


{/* Round Navigation */}
<div className="flex overflow-x-auto whitespace-nowrap py-2 mb-6">
  {roundsData
    .filter((round, index, self) => 
      // Filter out duplicate round numbers
      index === self.findIndex(r => r.number === round.number)
    )
    .sort((a, b) => a.number - b.number) // Ensure correct order
    .map((round) => (
      <button
        key={`round-${round.number}-${round.id}`}
        onClick={() => setActiveRound(round.number)}
        className={`px-4 py-2 rounded-full mr-2 flex items-center ${
          activeRound === round.number
            ? 'bg-blue-100 text-blue-800 font-medium'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <span>Round {round.number}</span>
        {round.number === Math.max(...roundsData.map(r => r.number)) && (
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {round.status === 'completed' ? 'Final' : 'Current'}
          </span>
        )}
      </button>
    ))}
</div>
        {/* Round Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {currentRound && currentRound.number === roundsData.length
                ? 'Final Decision Round'
                : `Round ${currentRound ? currentRound.number : '?'}`}
            </h2>
            <div className="text-sm text-gray-500 flex items-center">
              <Users size={16} className="mr-1" />
              {currentRound && currentRound.activeMembers ? currentRound.activeMembers.length : '?'} Active Members
            </div>
          </div>

          {renderTabs()}

          <div className="mt-6">
            {activeTab === 'discussion' && renderDiscussion()}
            {activeTab === 'voting' && renderVoting()}
            {activeTab === 'result' &&
              currentRound && currentRound.number === roundsData.length &&
              renderFinalResult()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharkTank;