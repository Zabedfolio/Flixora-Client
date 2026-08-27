import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId') || 'premium';

    const PLANS_MAP: Record<
      string,
      { name: string; price: number; description: string }
    > = {
      basic: {
        name: 'Flixora Basic Plan',
        price: 799,
        description:
          '720p (HD), 1 screen, No downloads, Ad-supported, 1 kids profile',
      },
      standard: {
        name: 'Flixora Standard Plan',
        price: 1199,
        description:
          '1080p (FHD), 2 screens, Standard downloads, Ad-free, 3 kids profiles',
      },
      premium: {
        name: 'Flixora Premium Plan',
        price: 1499,
        description:
          '4K + HDR, 4 screens, Unlimited downloads, Ad-free, Unlimited kids profiles',
      },
    };

    const plan = PLANS_MAP[planId] || PLANS_MAP.premium;
    const origin = request.nextUrl.origin;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel?error=Payment%20cancelled%20by%20user`,
    });

    if (!session.url) {
      return NextResponse.redirect(
        `${origin}/cancel?error=Failed%20to%20create%20checkout%20session`,
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    const origin = request.nextUrl.origin;
    const errorMessage =
      err instanceof Error ? err.message : 'An error occurred during checkout';
    return NextResponse.redirect(
      `${origin}/cancel?error=${encodeURIComponent(errorMessage)}`,
    );
  }
}
