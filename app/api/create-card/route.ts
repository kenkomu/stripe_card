import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
  const { cardholderName } = await request.json();

  try {
    // Create a cardholder
    const cardholder = await stripe.issuing.cardholders.create({
      name: cardholderName,
      email: 'test@example.com',
      type: 'individual',
      billing: {
        address: {
          line1: '2167',
          city: 'Nairobi',
          state: 'CA',
          country: 'US',
          postal_code: '00200',
        },
      },
      status: 'active', // Ensure cardholder is active
    });

    // Create a virtual card for the cardholder
    const virtualCard = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency: 'usd',
      type: 'virtual',
      status: 'active', // Ensure the card is active
      spending_controls: {
        spending_limits: [
          {
            amount: 50000, // In cents (500 USD)
            interval: 'daily',
          },
        ],
      },
    });

    // Return the virtual card details
    return NextResponse.json({ virtualCard });
  } catch (error: any) {
    console.error('Error creating cardholder or virtual card:', error);
    return NextResponse.json({ error: error.message });
  }
}
