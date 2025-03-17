// lib/firebase.js
// Firebase configuration and utility functions
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let db;

// Safely initialize Firebase (for SSR compatibility)
if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Function to get the firestore instance
export const getDb = () => {
  if (!db) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
};

// Products Collection Functions
export async function createProduct(productData) {
  const db = getDb();
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      status: 'pending', // pending, active, completed
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function getProduct(productId) {
  const db = getDb();
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

export async function getRecentProducts(limit = 10) {
  const db = getDb();
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting recent products:', error);
    throw error;
  }
}

export async function updateProductStatus(productId, status) {
  const db = getDb();
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
}

// Rounds Collection Functions
// Update or verify the createRound function in lib/firebase.js

export async function createRound(productId, roundData) {
  const db = getDb();
  try {
    // Ensure the roundData has all required fields
    const completeRoundData = {
      productId,
      number: roundData.number || 1,
      activeMembers: roundData.activeMembers || [],
      discussion: roundData.discussion || [],
      votes: roundData.votes || {},
      eliminated: roundData.eliminated || null,
      status: roundData.status || 'in-progress',
      createdAt: serverTimestamp(),
      ...roundData  // Include any other fields from roundData
    };
    
    const docRef = await addDoc(collection(db, 'rounds'), completeRoundData);
    
    // Return the created round with its ID
    return { 
      id: docRef.id, 
      ...completeRoundData 
    };
  } catch (error) {
    console.error('Error creating round:', error);
    throw error;
  }
}

export async function getProductRounds(productId) {
  const db = getDb();
  try {
    const q = query(
      collection(db, 'rounds'),
      where('productId', '==', productId),
      orderBy('number', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting product rounds:', error);
    throw error;
  }
}

export async function updateRound(roundId, roundData) {
  const db = getDb();
  try {
    const docRef = doc(db, 'rounds', roundId);
    
    // First get the current round data to ensure we're not overwriting
    const currentRoundDoc = await getDoc(docRef);
    
    if (!currentRoundDoc.exists()) {
      console.error(`Round ${roundId} not found while updating`);
      throw new Error('Round not found');
    }
    
    const currentRoundData = currentRoundDoc.data();
    
    // Special handling for discussion array to ensure we don't lose messages
    if (roundData.discussion) {
      // Make sure we're not overwriting existing messages
      // If both have discussion arrays, merge them
      if (currentRoundData.discussion) {
        // Create a map of existing messages by member to avoid duplicates
        const existingMessages = {};
        currentRoundData.discussion.forEach((msg, index) => {
          existingMessages[msg.member] = msg;
        });
        
        // Add new messages, overwriting if member already has a message
        roundData.discussion.forEach(msg => {
          existingMessages[msg.member] = msg;
        });
        
        // Convert back to array
        roundData.discussion = Object.values(existingMessages);
      }
      // else, we're adding the first messages, so no merging needed
    }
    
    // Update with the merged data
    await updateDoc(docRef, {
      ...roundData,
      updatedAt: serverTimestamp(),
    });
    
    console.log(`Successfully updated round ${roundId} with ${roundData.discussion ? roundData.discussion.length : 0} discussion messages`);
    
    return true;
  } catch (error) {
    console.error('Error updating round:', error);
    throw error;
  }
}

// Model Stats Functions
export async function updateModelStats(modelId, stats) {
  const db = getDb();
  try {
    const docRef = doc(db, 'modelStats', modelId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing stats
      const currentStats = docSnap.data();

      await updateDoc(docRef, {
        acceptRate: calculateNewRate(
          currentStats.acceptRate,
          stats.acceptRate,
          currentStats.totalReviews
        ),
        totalReviews: currentStats.totalReviews + 1,
        uniqueInsights: calculateNewRate(
          currentStats.uniqueInsights,
          stats.uniqueInsights,
          currentStats.totalReviews
        ),
        avgSentiment: calculateNewRate(
          currentStats.avgSentiment,
          stats.avgSentiment,
          currentStats.totalReviews
        ),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new stats document
      await addDoc(collection(db, 'modelStats'), {
        modelId,
        acceptRate: stats.acceptRate,
        totalReviews: 1,
        uniqueInsights: stats.uniqueInsights,
        avgSentiment: stats.avgSentiment,
        createdAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating model stats:', error);
    throw error;
  }
}

export async function getModelStats() {
  const db = getDb();
  try {
    const querySnapshot = await getDocs(collection(db, 'modelStats'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting model stats:', error);
    throw error;
  }
}

// Helper function to calculate new rolling average
function calculateNewRate(currentRate, newValue, totalItems) {
  return (currentRate * totalItems + newValue) / (totalItems + 1);
}

// Export an object with all functions
export const firebaseDB = {
  createProduct,
  getProduct,
  getRecentProducts,
  updateProductStatus,
  createRound,
  getProductRounds,
  updateRound,
  updateModelStats,
  getModelStats,
};

export default firebaseDB;
