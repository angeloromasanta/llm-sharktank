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
export async function createRound(productId, roundData) {
  const db = getDb();
  try {
    const docRef = await addDoc(collection(db, 'rounds'), {
      productId,
      ...roundData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...roundData };
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
    await updateDoc(docRef, {
      ...roundData,
      updatedAt: serverTimestamp(),
    });
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
