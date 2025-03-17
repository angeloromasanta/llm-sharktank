// components/SetupForm.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle, PlusCircle, AlertCircle } from 'lucide-react';

const SetupForm = () => {
  // Update the state in SetupForm.tsx to track model positions
  // Update the state in SetupForm.tsx to track model positions
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    askingFor: '',
    numberOfRounds: 4,
    selectedModels: {
      'meta-llama/llama-3.3-70b-instruct': {
        selected: true,
        positions: { pro: false, neutral: true, against: false },
      },
      'google/gemini-2.0-flash-001': {
        selected: true,
        positions: { pro: false, neutral: true, against: false },
      },
      'mistralai/mistral-nemo': {
        selected: true,
        positions: { pro: false, neutral: true, against: false },
      },
      'openai/gpt-4o-mini': {
        selected: true,
        positions: { pro: false, neutral: true, against: false },
      },
      'deepseek/deepseek-chat': {
        selected: true,
        positions: { pro: false, neutral: true, against: false },
      },
      'anthropic/claude-3.7-sonnet': {
        selected: true,
        positions: { pro: false, neutral: true, against: false },
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

  const handleModelToggle = (modelId, position) => {
    // Get the current state for this model
    const currentModel = formData.selectedModels[modelId];

    // Toggle the specified position
    const newPositions = {
      ...currentModel.positions,
      [position]: !currentModel.positions[position],
    };

    // Determine if any position is selected
    const hasAnyPositionSelected =
      newPositions.pro || newPositions.neutral || newPositions.against;

    // Update the model with new positions and selection status
    setFormData({
      ...formData,
      selectedModels: {
        ...formData.selectedModels,
        [modelId]: {
          selected: hasAnyPositionSelected, // Model is selected if at least one position is active
          positions: newPositions,
        },
      },
    });
  };

  // Update the countSelectedModels function
  const countSelectedModels = () => {
    return Object.values(formData.selectedModels).filter((v) => v.selected)
      .length;
  };

  // Count total model-position combinations (for tracking total participants)
  const countTotalModelPositions = () => {
    let count = 0;
    Object.values(formData.selectedModels).forEach((model) => {
      if (model.selected) {
        Object.values(model.positions).forEach((isPositionActive) => {
          if (isPositionActive) count++;
        });
      }
    });
    return count;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add confirmation step before proceeding
    if (!isSubmitting && !isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect would happen here in a real app
      setTimeout(() => {
        window.location.href = `/products/new-${Date.now()}`;
      }, 2000);
    }, 2000);
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
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleModelToggle(model.id, 'pro')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            formData.selectedModels[model.id].positions.pro
                              ? 'bg-green-100 text-green-800 border-2 border-green-500 shadow-sm'
                              : 'bg-white text-gray-600 border border-gray-300 hover:bg-green-50'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs">Pro</span>
                            <span className="text-xs">(Option A)</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleModelToggle(model.id, 'neutral')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            formData.selectedModels[model.id].positions.neutral
                              ? 'bg-blue-100 text-blue-800 border-2 border-blue-500 shadow-sm'
                              : 'bg-white text-gray-600 border border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span>Neutral</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleModelToggle(model.id, 'against')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            formData.selectedModels[model.id].positions.against
                              ? 'bg-red-100 text-red-800 border-2 border-red-500 shadow-sm'
                              : 'bg-white text-gray-600 border border-gray-300 hover:bg-red-50'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs">Against</span>
                            <span className="text-xs">(Option B)</span>
                          </div>
                        </button>
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
                    <p className="text-sm text-blue-600 font-medium mt-2">
                      {formData.askingFor}
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

                              {formData.selectedModels[model.id].positions
                                .pro && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  Pro (Option A)
                                </span>
                              )}

                              {formData.selectedModels[model.id].positions
                                .neutral && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                  Neutral
                                </span>
                              )}

                              {formData.selectedModels[model.id].positions
                                .against && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                  Against (Option B)
                                </span>
                              )}

                              {!formData.selectedModels[model.id].positions
                                .pro &&
                                !formData.selectedModels[model.id].positions
                                  .neutral &&
                                !formData.selectedModels[model.id].positions
                                  .against && (
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
