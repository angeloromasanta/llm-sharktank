// app/setup/page.tsx

import React from 'react';
import SetupForm from '../../components/SetupForm';

export default function SetupPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New LLM Shark Tank Run</h1>
        <p className="text-gray-600 mt-1">
          Set up a product to be evaluated by multiple AI models in a Shark Tank
          style format
        </p>
      </div>

      <SetupForm />
    </div>
  );
}
