'use client';

import React, { useEffect, useState } from 'react';
import SharkTank from '../../../components/SharkTank';
import { getProduct, createRound, updateRound, updateProductStatus, getProductRounds } from '../../../lib/firebase';
import { simulateModelResponse } from '../../../lib/api';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startDiscussionProcess = async (productData) => {
    try {
      console.log("Starting discussion process for:", productData.name);
      
      // Update product status to active immediately
      await updateProductStatus(productData.id, 'active');
      
      // Generate member configurations from selectedModels
      const members = [];
      let memberCounter = 1;
      
      Object.entries(productData.selectedModels).forEach(([modelId, positions]) => {
        Object.entries(positions).forEach(([position, count]) => {
          for (let i = 0; i < count; i++) {
            members.push({
              memberId: `Member ${memberCounter}`,
              model: modelId,
              position: position
            });
            memberCounter++;
          }
        });
      });
      
      console.log(`Generated ${members.length} members for discussion`);
      
      // Get the total number of rounds
      const totalRounds = parseInt(productData.numberOfRounds);
      
      // Track active members
      let activeMembers = members.map(m => m.memberId);
      let eliminatedMembers = [];
      let allDiscussion = [];
      
      // Check for existing rounds first
      const existingRounds = await getProductRounds(productData.id);
      console.log(`Found ${existingRounds.length} existing rounds`);
      
      // Create a map of round numbers to round objects
      const roundMap = {};
      existingRounds.forEach(round => {
        roundMap[round.number] = round;
      });
      
      // Process each round sequentially
      for (let roundNum = 1; roundNum <= totalRounds; roundNum++) {
        let currentRound = roundMap[roundNum];
        
        // Create the round if it doesn't exist
        if (!currentRound) {
          console.log(`Creating round ${roundNum} for product ${productData.id}`);
          
          // Create round data structure
          const roundData = {
            number: roundNum,
            productId: productData.id,
            activeMembers: [...activeMembers],
            discussion: [],
            votes: {},
            eliminated: null,
            status: 'in-progress'
          };
          
          // Create round in Firebase
          const newRound = await createRound(productData.id, roundData);
          currentRound = newRound;
        } else {
          console.log(`Round ${roundNum} already exists with id ${currentRound.id}`);
          
          // Update round status to in-progress
          await updateRound(currentRound.id, { 
            status: 'in-progress',
            activeMembers: [...activeMembers]
          });
        }
        
        // Process discussion for each active member
        for (const memberId of activeMembers) {
          try {
            // Skip if this member already has a response in this round
            const existingResponse = currentRound.discussion?.find(msg => msg.member === memberId);
            if (existingResponse) {
              console.log(`Member ${memberId} already has a response in round ${roundNum}, skipping`);
              continue;
            }
            
            // Find the member's model and position
            const member = members.find(m => m.memberId === memberId);
            
            // Generate a simulated response
            const responseText = await simulateModelResponse({
              round: roundNum,
              productName: productData.name,
              position: member.position,
              model: member.model,
              previousDiscussion: allDiscussion,
              eliminatedMembers
            });
            
            // Add to discussion
            const messageData = {
              member: memberId,
              model: member.model,
              position: member.position,
              content: responseText
            };
            
            // Add to both local tracking and firebase
            allDiscussion.push(messageData);
            
            // Update round with the new message
            // IMPORTANT: Send only the new message, not the entire discussion array
            await updateRound(currentRound.id, { 
              discussion: [messageData]  // Send as array with one item
            });
            
            console.log(`Added response for ${memberId} in round ${roundNum}`);
            
            // Add a small delay between responses to prevent Firebase rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`Error processing response for ${memberId} in round ${roundNum}:`, error);
          }
        }
        
        // Skip elimination in final round
        if (roundNum < totalRounds) {
          // Process elimination voting
          console.log(`Processing elimination voting for round ${roundNum}`);
          
          const votes = {};
          for (const memberId of activeMembers) {
            // Find eligible members to vote for (can't vote for self)
            const eligibleMembers = activeMembers.filter(m => m !== memberId);
            
            // For simplicity, each member votes for a random other member
            const votedFor = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
            
            // Record the vote
            votes[memberId] = votedFor;
          }
          
          // Update round with votes
          await updateRound(currentRound.id, { votes: votes });
          
          // Process votes to determine elimination
          const voteCounts = {};
          activeMembers.forEach(member => { voteCounts[member] = 0; });
          
          Object.values(votes).forEach(votee => {
            if (voteCounts[votee] !== undefined) {
              voteCounts[votee]++;
            }
          });
          
          // Find member with most votes
          let maxVotes = 0;
          let mostVoted = [];
          
          Object.entries(voteCounts).forEach(([member, count]) => {
            if (count > maxVotes) {
              maxVotes = count;
              mostVoted = [member];
            } else if (count === maxVotes) {
              mostVoted.push(member);
            }
          });
          
          // For simplicity, eliminate the first member with most votes
          const eliminated = mostVoted[0];
          
          // Update active/eliminated members
          activeMembers = activeMembers.filter(m => m !== eliminated);
          eliminatedMembers.push(eliminated);
          
          // Update round with elimination result
          await updateRound(currentRound.id, { 
            eliminated, 
            status: 'completed',
            votes: votes 
          });
          
          console.log(`Eliminated ${eliminated} in round ${roundNum}`);
          
          // Add some delay between rounds
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          // Final round logic - investment decisions (simplified)
          console.log(`Processing final round ${roundNum}`);
          
          const finalVotes = {};
          
          for (const memberId of activeMembers) {
            // Find the member's position
            const member = members.find(m => m.memberId === memberId);
            
            // Determine if they would invest based on position (simplified)
            let decision;
            if (member.position === 'pro') {
              decision = 'In';
            } else if (member.position === 'against') {
              decision = 'Out';
            } else {
              // For neutral positions, randomize
              decision = Math.random() < 0.5 ? 'In' : 'Out';
            }
            
            finalVotes[memberId] = decision;
          }
          
          // Calculate overall result
          const inVotes = Object.values(finalVotes).filter(v => v === 'In').length;
          const outVotes = Object.values(finalVotes).filter(v => v === 'Out').length;
          
          const result = inVotes > outVotes ? 'In' : 'Out';
          
          // Update round with final votes and result
          await updateRound(currentRound.id, { 
            finalVotes: finalVotes,
            result: result,
            status: 'completed'
          });
          
          console.log(`Final round result: ${result}`);
        }
      }
      
      // Update product status to completed
      await updateProductStatus(productData.id, 'completed');
      console.log(`Discussion process completed for product ${productData.id}`);
      
    } catch (error) {
      console.error("Error in discussion process:", error);
      await updateProductStatus(productData.id, 'error');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get product data from Firebase
        const productData = await getProduct(params.id);
        setProduct(productData);
        
        console.log(`Fetched product ${params.id} with status: ${productData.status}`);
        
        // Start discussion process if product is in pending state
        if (productData.status === 'pending') {
          console.log("Product is pending - starting discussion process");
          startDiscussionProcess(productData);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
      <p className="ml-3 text-gray-600">Loading product data...</p>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return <SharkTank productData={product} />;
}