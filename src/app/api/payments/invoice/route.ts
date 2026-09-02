import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return new Response('Missing invoice payment ID', { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Query payment record
    const payment = await db.collection('payments').findOne({ _id: new ObjectId(paymentId) });
    if (!payment) {
      return new Response('Invoice / Payment not found', { status: 404 });
    }

    // Query user and plan details to display on invoice
    const user = await db.collection('user').findOne({ _id: new ObjectId(payment.userId) });
    const plan = await db.collection('plans').findOne({ _id: new ObjectId(payment.planId) });

    const formattedDate = payment.createdAt 
      ? new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const invoiceText = `
============================================================
                      FLIXORA INVOICE                      
============================================================
Invoice Number:   ${payment.invoiceId}
Payment Date:     ${formattedDate}
Status:           ${payment.status.toUpperCase()}
------------------------------------------------------------
CUSTOMER DETAILS
Customer Name:    ${user?.name || 'Valued Streamer'}
Customer Email:   ${user?.email || 'N/A'}
------------------------------------------------------------
SUBSCRIPTION DETAILS
Product / Plan:   Flixora ${plan?.name || 'Premium'} Plan
Resolution:       ${plan?.resolution || '4K + HDR'}
Billing Mode:     Recurring Monthly
------------------------------------------------------------
CHARGES SUMMARY
Subtotal:         ${payment.amount}
Tax / VAT:        $0.00
------------------------------------------------------------
TOTAL PAID:       ${payment.amount} USD
============================================================
Thank you for subscribing to Flixora!
Enjoy unlimited movies and TV shows.
For support, contact support@flixora.com
============================================================
`;

    return new Response(invoiceText.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename=invoice_${payment.invoiceId}.txt`
      }
    });
  } catch (error: any) {
    console.error('Invoice generation error:', error);
    return new Response(`Error generating invoice: ${error.message}`, { status: 500 });
  }
}
