// lib/api.js
// API Base URL
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to generate a response from a specific LLM model
export async function generateModelResponse({
  model,
  prompt,
  maxTokens = 1000,
  apiKey = process.env.OPENROUTER_API_KEY,
}) {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer':
      process.env.NEXT_PUBLIC_APP_URL || 'https://llm-shark-tank.example.com',
  };

  const payload = {
    model: model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('Unexpected API response structure');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

// Function to generate a batch of responses from multiple models
export async function generateBatchResponses({
  models,
  prompt,
  maxTokens = 1000,
  apiKey = process.env.OPENROUTER_API_KEY,
}) {
  const responses = {};

  // Execute requests sequentially to avoid rate limiting
  for (const model of models) {
    try {
      const response = await generateModelResponse({
        model,
        prompt,
        maxTokens,
        apiKey,
      });

      responses[model] = response;
    } catch (error) {
      console.error(`Error getting response from ${model}:`, error);
      responses[model] = `[Error: Failed to get response from ${model}]`;
    }

    // Add a small delay between requests to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return responses;
}

// Function to generate prompts for different discussion rounds
export function generatePrompt({
  round,
  productName,
  productDescription,
  askingFor,
  previousDiscussion = [],
  stance = 'neutral', // 'pro', 'against', or 'neutral'
  eliminatedMembers = [],
}) {
  const baseContext = `
  You are a member of an AI investment panel evaluating a product pitch in a "Shark Tank" style format.
  
  Product: ${productName}
  Description: ${productDescription}
  Investment Ask: ${askingFor}
  `;

  // Add stance-specific instructions
  let stanceInstructions = '';
  if (stance === 'pro') {
    stanceInstructions = `
    IMPORTANT: You tend to be optimistic about new ventures. Look for the potential in this product and focus more on 
    the upside than the risks. This doesn't mean you should ignore problems, but you should give the benefit of the doubt
    when possible.
    `;
  } else if (stance === 'against') {
    stanceInstructions = `
    IMPORTANT: You tend to be skeptical about new ventures. Focus on identifying potential risks, challenges, and flaws
    in the business model. Ask critical questions that test the validity of the product's claims and market opportunity.
    `;
  } else {
    stanceInstructions = `
    IMPORTANT: Maintain a balanced perspective. Evaluate both the strengths and weaknesses of the product based on the
    information provided. Be neither overly optimistic nor excessively critical.
    `;
  }

  // Build the specific prompt based on the round
  let roundPrompt = '';

  if (round === 1) {
    // First round - initial reactions
    roundPrompt = `
    This is round 1 of the discussion. Share your initial thoughts on this product pitch.
    Consider aspects like market opportunity, competitive landscape, business model, and potential challenges.
    Be thoughtful but concise (3-5 sentences). Give honest feedback that would be helpful to the entrepreneur.
    `;
  } else {
    // Subsequent rounds - build on the discussion
    const previousDiscussionText = previousDiscussion
      .map((msg) => `${msg.member}: ${msg.content}`)
      .join('\n\n');

    const eliminatedText =
      eliminatedMembers.length > 0
        ? `The following panel members have been eliminated: ${eliminatedMembers.join(
            ', '
          )}.`
        : '';

    roundPrompt = `
    This is round ${round} of the discussion. Here is the discussion so far:
    
    ${previousDiscussionText}
    
    ${eliminatedText}
    
    Based on the previous discussion, continue the conversation by adding your perspective.
    You can respond directly to points made by other panel members or introduce new considerations.
    Be thoughtful but concise (3-5 sentences).
    `;
  }

  return `${baseContext}\n${stanceInstructions}\n${roundPrompt}`;
}

// Function to generate elimination voting prompt
export function generateEliminationPrompt({
  round,
  productName,
  activeMembers,
  previousDiscussion = [],
}) {
  const previousDiscussionText = previousDiscussion
    .map((msg) => `${msg.member}: ${msg.content}`)
    .join('\n\n');

  const eligibleMembers = activeMembers.join(', ');

  return `
  You are a member of an AI investment panel evaluating a product pitch for "${productName}" in a "Shark Tank" style format.
  
  It's time to vote on which panel member should be eliminated from the discussion after round ${round}.
  
  Here's the discussion from this round:
  
  ${previousDiscussionText}
  
  Based on the contributions in this round, which panel member do you think added the least value to the discussion?
  Consider factors like insight, analytical depth, and uniqueness of perspective.
  
  You can vote to eliminate any of these members: ${eligibleMembers}
  
  Be strategic in your voting. You want the final panel to make the best possible decision about the product.
  
  End your response with "I vote to eliminate: [Member Name]"
  `;
}

// Function to generate final decision prompt
export function generateFinalDecisionPrompt({
  productName,
  productDescription,
  askingFor,
  allDiscussion = [],
}) {
  const allDiscussionText = allDiscussion
    .map((msg) => `${msg.member}: ${msg.content}`)
    .join('\n\n');

  return `
  You are a finalist in the AI investment panel evaluating "${productName}".
  
  Product: ${productName}
  Description: ${productDescription}
  Investment Ask: ${askingFor}
  
  Here's the full discussion that has taken place:
  
  ${allDiscussionText}
  
  It's now time to make your final decision. Based on the entire discussion and your analysis:
  
  1. Provide a brief summary of your reasoning (2-3 sentences)
  2. Explicitly state whether you would invest in this product or not
  
  End your response with either "Final decision: Invest" or "Final decision: Pass"
  `;
}
