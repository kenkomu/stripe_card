'use client';

import React, { useState } from 'react';

const CardholderPage: React.FC = () => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardholderName }),
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setCardDetails(data.virtualCard);
      }
    } catch (error) {
      console.error('Error creating cardholder and card:', error);
      setErrorMessage('An error occurred while processing your request.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Create a Virtual Card</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create Card
          </button>
        </form>

        {errorMessage && (
          <div className="text-red-500 mt-4">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {cardDetails && (
          <div className="mt-6">
            <h2 className="text-lg font-medium">Card Created!</h2>
            <p><strong>Card Number (last 4 digits):</strong> {cardDetails.last4}</p>
            <p><strong>Expiration Date:</strong> {cardDetails.exp_month}/{cardDetails.exp_year}</p>
            <p><strong>Brand:</strong> {cardDetails.brand}</p>
            <p><strong>Card Type:</strong> {cardDetails.type}</p>
            {/* Add more card details if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardholderPage;
