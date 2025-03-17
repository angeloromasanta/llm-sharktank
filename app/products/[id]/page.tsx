// app/products/[id]/page.tsx

import React from 'react';
import SharkTank from '../../../components/SharkTank';

// This would normally fetch data based on the ID
export default function ProductPage({ params }) {
  // Mock data for the product
  const productData = {
    id: params.id,
    name: 'MarketPulse AI',
    description:
      'An AI-powered market research tool that analyzes social media trends, news, and customer feedback to predict market shifts before they happen.',
    askingFor: '$500,000 for 10% equity',
    imageUrl: '/api/placeholder/300/200',
  };

  return (
    <div>
      <SharkTank productData={productData} />
    </div>
  );
}
