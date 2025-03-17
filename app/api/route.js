// Combined API routes for LLM Shark Tank
import { NextResponse } from 'next/server';
import { 
  generateModelResponse, 
  generateBatchResponses, 
  generatePrompt, 
  generateEliminationPrompt, 
  generateFinalDecisionPrompt 
} from '../../lib/api';
import { 
  createProduct, 
  getProduct, 
  updateProductStatus, 
  createRound, 
  getProductRounds, 
  updateRound, 
  updateModelStats 
} from '../../lib/firebase';

// Create a new product and start the discussion process
export async function POST(request) {
  try {
    const data = await request.json();
    const { productName, productDescription, askingFor, numberOfRounds, selectedModels } = data;
    
    // Validate required fields
    if (!productName || !productDescription || !askingFor || !selectedModels) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get array of selected models
    const modelIds = Object.keys(selectedModels).filter(id => selectedModels[id]);
    
    if (modelIds.length < 3) {
      return NextResponse.json({ error: 'At least 3 models are required' }, { status: 400 });
    }
    
    // Create product record
    const product = await createProduct({
      name: productName,
      description: productDescription,
      askingFor,
      numberOfRounds: parseInt(numberOfRounds, 10) || 4,
      modelIds,
    });
    
    // Start discussion process asynchronously
    startDiscussionProcess(product.id)
      .catch(error => console.error('Error in discussion process:', error));
    
    return NextResponse.json({ 
      success: true, 
      product: {
        id: product.id,
        name: product.name
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get product details and round information
export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const productId = searchParams.get('productId');
  
  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }
  
  try {
    const product = await getProduct(productId);
    const rounds = await getProductRounds(productId);
    
    return NextResponse.json({ 
      product,
      rounds
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to assign stances to models
function assignModelStances(modelIds) {
  const stances = ['pro', 'against', 'neutral'];
  const modelStances = {};
  
  // Distribute stances evenly
  modelIds.forEach((modelId, index) => {
    const stanceIndex = index % stances.length;
    modelStances[modelId] = stances[stanceIndex];
  });
  
  return modelStances;
}

// Function to generate member names
function generateMemberNames(count) {
  return Array.from({ length: count }, (_, i) => `Member ${i + 1}`);
}

// The main discussion process
async function startDiscussionProcess(productId) {
  try {
    // Get product details
    const product = await getProduct(productId);
    const { name, description, askingFor, numberOfRounds, modelIds } = product;
    
    // Update product status to active
    await updateProductStatus(productId, 'active');
    
    // Assign stances to models
    const modelStances = assignModelStances(modelIds);
    
    // Generate member names
    const members = generateMemberNames(modelIds.length);
    
    // Map models to members
    const memberModels = {};
    members.forEach((member, index) => {
      memberModels[member] = modelIds[index];
    });
    
    // Track active and eliminated members
    let activeMembers = [...members];
    const eliminatedMembers = [];
    
    // Store all discussion data
    const allDiscussion = [];
    
    // Process each round
    for (let roundNumber = 1; roundNumber <= numberOfRounds; roundNumber++) {
      console.log(`Processing round ${roundNumber} for product ${productId}`);
      
      // Initialize round data
      const roundData = {
        number: roundNumber,
        productId,
        activeMembers,
        discussion: [],
        votes: {},
        eliminated: null,
        status: 'in-progress'
      };
      
      // Create round record
      const round = await createRound(productId, roundData);
      
      // Discussion phase
      for (const member of activeMembers) {
        const modelId = memberModels[member];
        const stance = modelStances[modelId];
        
        // Generate the prompt for this member
        const prompt = generatePrompt({
          round: roundNumber,
          productName: name,
          productDescription: description,
          askingFor,
          previousDiscussion: allDiscussion,
          stance,
          eliminatedMembers
        });
        
        // Get response from the model
        const response = await generateModelResponse({
          model: modelId,
          prompt,
          maxTokens: 1000
        });
        
        // Add to discussion
        const messageData = {
          member,
          model: modelId,
          content: response
        };
        
        roundData.discussion.push(messageData);
        allDiscussion.push(messageData);
        
        // Update round with the new discussion
        await updateRound(round.id, { discussion: roundData.discussion });
      }
      
      // Skip elimination in final round
      if (roundNumber < numberOfRounds) {
        // Elimination voting phase
        for (const member of activeMembers) {
          const modelId = memberModels[member];
          
          // Generate elimination voting prompt
          const prompt = generateEliminationPrompt({
            round: roundNumber,
            productName: name,
            activeMembers: activeMembers.filter(m => m !== member), // Can't vote for self
            previousDiscussion: roundData.discussion
          });
          
          // Get response from the model
          const response = await generateModelResponse({
            model: modelId,
            prompt,
            maxTokens: 500
          });
          
          // Extract the vote
          const voteMatch = response.match(/I vote to eliminate: (Member \d+)/i);
          let votedFor = null;
          
          if (voteMatch && voteMatch[1]) {
            const candidateMember = voteMatch[1];
            // Make sure the voted member is active and not self
            if (activeMembers.includes(candidateMember) && candidateMember !== member) {
              votedFor = candidateMember;
            }
          }
          
          // If no valid vote, pick a random active member that isn't self
          if (!votedFor) {
            const validOptions = activeMembers.filter(m => m !== member);
            votedFor = validOptions[Math.floor(Math.random() * validOptions.length)];
          }
          
          // Add vote to round data
          roundData.votes[member] = votedFor;
          
          // Update round with votes
          await updateRound(round.id, { votes: roundData.votes });
        }
        
        // Process votes and determine who is eliminated
        const voteCounts = {};
        activeMembers.forEach(member => {
          voteCounts[member] = 0;
        });
        
        Object.values(roundData.votes).forEach(votedMember => {
          voteCounts[votedMember]++;
        });
        
        // Find member(s) with most votes
        const maxVotes = Math.max(...Object.values(voteCounts));
        const mostVoted = Object.keys(voteCounts).filter(member => voteCounts[member] === maxVotes);
        
        // In case of a tie, randomly select one
        const eliminated = mostVoted[Math.floor(Math.random() * mostVoted.length)];
        
        // Update elimination info
        roundData.eliminated = eliminated;
        roundData.status = 'completed';
        
        // Update round with elimination
        await updateRound(round.id, { 
          eliminated, 
          status: 'completed' 
        });
        
        // Update active and eliminated members
        activeMembers = activeMembers.filter(member => member !== eliminated);
        eliminatedMembers.push(eliminated);
      } else {
        // Final round - investment decision
        roundData.finalVotes = {};
        
        for (const member of activeMembers) {
          const modelId = memberModels[member];
          
          // Generate final decision prompt
          const prompt = generateFinalDecisionPrompt({
            productName: name,
            productDescription: description,
            askingFor,
            allDiscussion
          });
          
          // Get response from the model
          const response = await generateModelResponse({
            model: modelId,
            prompt,
            maxTokens: 1000
          });
          
          // Extract the decision
          const investMatch = response.match(/Final decision: (Invest|Pass)/i);
          let decision = null;
          
          if (investMatch && investMatch[1]) {
            decision = investMatch[1].toLowerCase() === 'invest' ? 'In' : 'Out';
          } else {
            // Default if no clear decision
            decision = Math.random() > 0.5 ? 'In' : 'Out';
          }
          
          // Add decision to final votes
          roundData.finalVotes[member] = decision;
          
          // Update model stats
          await updateModelStats(modelId, {
            acceptRate: decision === 'In' ? 100 : 0,
            uniqueInsights: Math.floor(Math.random() * 30) + 60, // Mock data 60-90
            avgSentiment: Math.floor(Math.random() * 20) + 60 // Mock data 60-80
          });
        }
        
        // Calculate overall result
        const inVotes = Object.values(roundData.finalVotes).filter(v => v === 'In').length;
        const outVotes = Object.values(roundData.finalVotes).filter(v => v === 'Out').length;
        
        roundData.result = inVotes > outVotes ? 'In' : outVotes > inVotes ? 'Out' : 'In';
        roundData.status = 'completed';
        
        // Update round with final votes and result
        await updateRound(round.id, { 
          finalVotes: roundData.finalVotes,
          result: roundData.result,
          status: 'completed'
        });
      }
    }
    
    // Update product status to completed
    await updateProductStatus(productId, 'completed');
    
    console.log(`Discussion process completed for product ${productId}`);
    
  } catch (error) {
    console.error(`Error in discussion process for product ${productId}:`, error);
    // Update product status to error
    await updateProductStatus(productId, 'error');
    throw error;
  }