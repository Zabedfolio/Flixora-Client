import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { auth } from '../../lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId') || 'premium';
    const fromPlanId = searchParams.get('fromPlanId') || '';

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
    
    // Retrieve session from cookie headers on the server side
    const authSession = await auth.api.getSession({
      headers: await headers()
    });
    
    const email = authSession?.user?.email || searchParams.get('email') || undefined;
    const name = authSession?.user?.name || searchParams.get('name') || undefined;

    let customerId: string | undefined = undefined;
    if (email) {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        if (name && customers.data[0].name !== name) {
          await stripe.customers.update(customerId, { name });
        }
      } else {
        const newCustomer = await stripe.customers.create({
          email,
          name: name || undefined
        });
        customerId = newCustomer.id;
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      ...(customerId ? { customer: customerId } : { customer_email: email }),
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
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&from=${encodeURIComponent(fromPlanId)}&to=${encodeURIComponent(planId)}`,
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
