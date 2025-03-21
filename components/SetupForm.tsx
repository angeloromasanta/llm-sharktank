// components/SetupForm.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle, PlusCircle, AlertCircle } from 'lucide-react';
import { createProduct } from '../lib/firebase';

const SetupForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    numberOfRounds: 4,
    selectedModels: {
      'meta-llama/llama-3.3-70b-instruct': {
        selected: true,
        positions: { pro: 0, neutral: 1, against: 0 },
      },
      'google/gemini-2.0-flash-001': {
        selected: true,
        positions: { pro: 0, neutral: 1, against: 0 },
      },
      'mistralai/mistral-nemo': {
        selected: true,
        positions: { pro: 0, neutral: 1, against: 0 },
      },
      'openai/gpt-4o-mini': {
        selected: true,
        positions: { pro: 0, neutral: 1, against: 0 },
      },
      'deepseek/deepseek-chat': {
        selected: true,
        positions: { pro: 0, neutral: 1, against: 0 },
      },
      'anthropic/claude-3.7-sonnet': {
        selected: true,
        positions: { pro: 0, neutral: 1, against: 0 },
      },
    },
  });
  

  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  // LLM Models available for selection
  const availableModels = [
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      name: 'Llama 3.3 70B Instruct',
      short: 'Llama',
      color: '#4f46e5',
    },
    {
      id: 'google/gemini-2.0-flash-001',
      name: 'Gemini 2.0 Flash',
      short: 'Gemini',
      color: '#0ea5e9',
    },
    {
      id: 'mistralai/mistral-nemo',
      name: 'Mistral Nemo',
      short: 'Mistral',
      color: '#8b5cf6',
    },
    {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      short: 'GPT-4o',
      color: '#10b981',
    },
    {
      id: 'deepseek/deepseek-chat',
      name: 'DeepSeek Chat',
      short: 'DeepSeek',
      color: '#f59e0b',
    },
    {
      id: 'anthropic/claude-3.7-sonnet',
      name: 'Claude 3.7 Sonnet',
      short: 'Claude',
      color: '#6366f1',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 // Update the handleModelToggle function to track counts instead of boolean values
const handleModelToggle = (modelId, position) => {
  // Get the current state for this model
  const currentModel = formData.selectedModels[modelId];
  
  // For the specified position, increment or decrement the count
  const currentCount = currentModel.positions[position] || 0;
  const newCount = currentCount > 0 ? currentCount + 1 : 1;
  
  // Update the positions with the new count
  const newPositions = {
    ...currentModel.positions,
    [position]: newCount,
  };
  
  // Determine if any position is selected
  const hasAnyPositionSelected = Object.values(newPositions).some(count => count > 0);
  
  // Update the model with new positions and selection status
  setFormData({
    ...formData,
    selectedModels: {
      ...formData.selectedModels,
      [modelId]: {
        selected: hasAnyPositionSelected,
        positions: newPositions,
      },
    },
  });
};

// Also add a function to decrement the position count
const handleModelDecrement = (modelId, position) => {
  // Get the current state for this model
  const currentModel = formData.selectedModels[modelId];
  
  // For the specified position, decrement the count (minimum 0)
  const currentCount = currentModel.positions[position] || 0;
  const newCount = currentCount > 1 ? currentCount - 1 : 0;
  
  // Update the positions with the new count
  const newPositions = {
    ...currentModel.positions,
    [position]: newCount,
  };
  
  // Determine if any position is selected
  const hasAnyPositionSelected = Object.values(newPositions).some(count => count > 0);
  
  // Update the model with new positions and selection status
  setFormData({
    ...formData,
    selectedModels: {
      ...formData.selectedModels,
      [modelId]: {
        selected: hasAnyPositionSelected,
        positions: newPositions,
      },
    },
  });
};
  // Update the countSelectedModels function
  

// Update the initial state to use counts instead of booleans

// Update the countSelectedModels function
const countSelectedModels = () => {
  return Object.values(formData.selectedModels).filter((model) => 
    Object.values(model.positions).some(count => count > 0)
  ).length;
};

// Update the countTotalModelPositions function
const countTotalModelPositions = () => {
  let count = 0;
  Object.values(formData.selectedModels).forEach((model) => {
    Object.values(model.positions).forEach((positionCount) => {
      count += positionCount;
    });
  });
  return count;
};


  
// Inside the SetupForm component
// Update the handleSubmit function in components/SetupForm.tsx

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isSubmitting && !isConfirming) {
    setIsConfirming(true);
    return;
  }

  setIsSubmitting(true);

  try {
    // Format model selections for Firebase
    const modelSelections = {};
    Object.entries(formData.selectedModels).forEach(([modelId, modelData]) => {
      if (modelData.selected) {
        modelSelections[modelId] = modelData.positions;
      }
    });

    // Create product in Firebase
    const product = await createProduct({
      name: formData.productName,
      description: formData.productDescription,
      numberOfRounds: parseInt(formData.numberOfRounds),
      selectedModels: modelSelections,
      status: 'pending'
    });

    setIsSuccess(true);

    // Redirect to product page after successful creation
    setTimeout(() => {
      window.location.href = `/products/${product.id}`;
    }, 1500);
  } catch (error) {
    console.error("Error creating product:", error);
    setIsSubmitting(false);
  }
};

  const nextStep = () => {
    setFormStep(formStep + 1);
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-blue-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          Create New LLM Shark Tank Run
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Set up a new product pitch to be evaluated by AI models
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Success!</h3>
          <p className="text-gray-600 mb-4">
            Your LLM Shark Tank run is being created. You'll be redirected
            shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div
                className={`flex flex-col items-center ${
                  formStep >= 1 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    formStep >= 1
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  1
                </div>
                <span className="text-xs mt-1">Product Details</span>
              </div>
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  formStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
              <div
                className={`flex flex-col items-center ${
                  formStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    formStep >= 2
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  2
                </div>
                <span className="text-xs mt-1">Model Selection</span>
              </div>
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  formStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
              <div
                className={`flex flex-col items-center ${
                  formStep >= 3 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    formStep >= 3
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  3
                </div>
                <span className="text-xs mt-1">Review & Submit</span>
              </div>
            </div>
            {/* Step 1: Product Details */}
            {formStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MarketPulse AI"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="productDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your product in detail..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="numberOfRounds"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Discussion Rounds
                  </label>
                  <select
                    id="numberOfRounds"
                    name="numberOfRounds"
                    value={formData.numberOfRounds}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 Rounds</option>
                    <option value={3}>3 Rounds</option>
                    <option value={4}>4 Rounds (Recommended)</option>
                    <option value={5}>5 Rounds</option>
                  </select>
                </div>
              </div>
            )}
            {/* Step 2: Model Selection */}
            {formStep === 2 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Select Model Positions for Shark Tank
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select positions for each AI model. Models with no positions
                  selected won't participate. You need at least 3 total
                  positions (across all models) to proceed.
                </p>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  {availableModels.map((model) => (
                    <div
                      key={model.id}
                      className={`p-4 border rounded-lg ${
                        formData.selectedModels[model.id].selected
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                            style={{ backgroundColor: model.color }}
                          >
                            {model.short.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {model.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {model.id}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Position selection buttons */}
                      {/* Position selection buttons - updated with counters */}
<div className="mt-3 grid grid-cols-3 gap-2">
  {/* Pro position */}
  <div
    className={`px-3 py-2 rounded-md text-sm transition-colors ${
      formData.selectedModels[model.id].positions.pro
        ? 'bg-green-100 text-green-800 border-2 border-green-500 shadow-sm'
        : 'bg-white text-gray-600 border border-gray-300'
    }`}
  >
    <div className="flex flex-col items-center">
      <span className="text-xs">Pro</span>
      <span className="text-xs">(Option A)</span>
      
      {/* Count display and controls */}
      <div className="flex items-center mt-1">
        <button
          type="button"
          onClick={() => handleModelDecrement(model.id, 'pro')}
          className="w-6 h-6 bg-gray-200 rounded-l text-gray-700 flex items-center justify-center hover:bg-gray-300"
          disabled={!formData.selectedModels[model.id].positions.pro}
        >
          -
        </button>
        <span className="w-8 text-center">
          {formData.selectedModels[model.id].positions.pro || 0}
        </span>
        <button
          type="button"
          onClick={() => handleModelToggle(model.id, 'pro')}
          className="w-6 h-6 bg-gray-200 rounded-r text-gray-700 flex items-center justify-center hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  </div>

  {/* Neutral position */}
  <div
    className={`px-3 py-2 rounded-md text-sm transition-colors ${
      formData.selectedModels[model.id].positions.neutral
        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500 shadow-sm'
        : 'bg-white text-gray-600 border border-gray-300'
    }`}
  >
    <div className="flex flex-col items-center">
      <span>Neutral</span>
      
      {/* Count display and controls */}
      <div className="flex items-center mt-1">
        <button
          type="button"
          onClick={() => handleModelDecrement(model.id, 'neutral')}
          className="w-6 h-6 bg-gray-200 rounded-l text-gray-700 flex items-center justify-center hover:bg-gray-300"
          disabled={!formData.selectedModels[model.id].positions.neutral}
        >
          -
        </button>
        <span className="w-8 text-center">
          {formData.selectedModels[model.id].positions.neutral || 0}
        </span>
        <button
          type="button"
          onClick={() => handleModelToggle(model.id, 'neutral')}
          className="w-6 h-6 bg-gray-200 rounded-r text-gray-700 flex items-center justify-center hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  </div>

  {/* Against position */}
  <div
    className={`px-3 py-2 rounded-md text-sm transition-colors ${
      formData.selectedModels[model.id].positions.against
        ? 'bg-red-100 text-red-800 border-2 border-red-500 shadow-sm'
        : 'bg-white text-gray-600 border border-gray-300'
    }`}
  >
    <div className="flex flex-col items-center">
      <span className="text-xs">Against</span>
      <span className="text-xs">(Option B)</span>
      
      {/* Count display and controls */}
      <div className="flex items-center mt-1">
        <button
          type="button"
          onClick={() => handleModelDecrement(model.id, 'against')}
          className="w-6 h-6 bg-gray-200 rounded-l text-gray-700 flex items-center justify-center hover:bg-gray-300"
          disabled={!formData.selectedModels[model.id].positions.against}
        >
          -
        </button>
        <span className="w-8 text-center">
          {formData.selectedModels[model.id].positions.against || 0}
        </span>
        <button
          type="button"
          onClick={() => handleModelToggle(model.id, 'against')}
          className="w-6 h-6 bg-gray-200 rounded-r text-gray-700 flex items-center justify-center hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  </div>
</div>
                    </div>
                  ))}
                </div>

                {(countSelectedModels() < 3 ||
                  countTotalModelPositions() < 3) && (
                  <div className="flex items-center p-3 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    <AlertCircle size={20} className="mr-2" />
                    <span className="text-sm">
                      {countSelectedModels() < 3
                        ? 'Please select at least 3 models to continue'
                        : 'Please select at least 3 role positions across your selected models'}
                    </span>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {countSelectedModels()} active models
                    </span>{' '}
                    with{' '}
                    <span className="font-medium">
                      {countTotalModelPositions()} total participants
                    </span>
                  </div>
                  <div className="text-xs text-blue-600">
                    (each model-position combination counts as one participant)
                  </div>
                </div>
              </div>
            )}
            {/* Step 3: Review & Submit */}
            {formStep === 3 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-4">
                  Review Your Setup
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Product Information
                    </h4>
                    <p className="font-medium">{formData.productName}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {formData.productDescription}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Discussion Format
                    </h4>
                    <p className="text-sm text-gray-700">
                      {formData.numberOfRounds} rounds of discussion
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Selected Models & Positions
                    </h4>
                    <div className="space-y-2 mt-2">
  {availableModels.map(
    (model) =>
      formData.selectedModels[model.id].selected && (
        <div
          key={model.id}
          className="flex items-center flex-wrap gap-2"
        >
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: model.color }}
            ></div>
            <span className="text-sm mr-2">
              {model.short}
            </span>
          </div>

          {formData.selectedModels[model.id].positions.pro > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Pro (Option A): {formData.selectedModels[model.id].positions.pro}
            </span>
          )}

          {formData.selectedModels[model.id].positions.neutral > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Neutral: {formData.selectedModels[model.id].positions.neutral}
            </span>
          )}

          {formData.selectedModels[model.id].positions.against > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Against (Option B): {formData.selectedModels[model.id].positions.against}
            </span>
          )}

          {!formData.selectedModels[model.id].positions.pro &&
            !formData.selectedModels[model.id].positions.neutral &&
            !formData.selectedModels[model.id].positions.against && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                No positions selected
              </span>
            )}
        </div>
      )
  )}
</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-6">
                  <PlusCircle size={20} className="text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Once submitted, the AI models will start discussing your
                      product and provide their evaluation. This process
                      typically takes 1-2 minutes to complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            {formStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
            )}

            {formStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
                disabled={formStep === 2 && countSelectedModels() < 3}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Start Evaluation'
                )}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default SetupForm;
