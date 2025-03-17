import React from 'react';
import Link from 'next/link';
import Leaderboard from '../components/Leaderboard';

export default function HomePage() {
  // Mock data for recent products
  const recentProducts = [
    {
      id: '1',
      name: 'MarketPulse AI',
      description:
        'AI-powered market research tool that analyzes social media trends, news, and customer feedback to predict market shifts.',
      askingFor: '$500,000 for 10%',
      result: 'Accepted',
      imageUrl: '/api/placeholder/300/200',
    },
    {
      id: '2',
      name: 'EcoShift Logistics',
      description:
        'Carbon-neutral delivery network using electric vehicles and AI route optimization.',
      askingFor: '$750,000 for 15%',
      result: 'Rejected',
      imageUrl: '/api/placeholder/300/200',
    },
    {
      id: '3',
      name: 'NeuroBand',
      description:
        'Wearable device that monitors brain activity and provides real-time cognitive performance feedback.',
      askingFor: '$350,000 for 5%',
      result: 'Accepted',
      imageUrl: '/api/placeholder/300/200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <Link
            href="/setup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Create New Run
          </Link>
        </div>
        <Leaderboard />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Pitches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 ${
                      product.result === 'Accepted'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    } text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {product.result}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {product.askingFor}
                  </p>
                  <p className="text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
