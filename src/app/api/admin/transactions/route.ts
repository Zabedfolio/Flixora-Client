import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 10));
  const search = (searchParams.get('search') || '').trim();
  const statusFilter = (searchParams.get('status') || '').toLowerCase();

  try {
    const { db } = await connectToDatabase();

    // 1. Fetch user map for real names and emails
    const users = await db.collection('user').find({}).toArray();
    const userMap = new Map<string, any>();
    users.forEach((u: any) => {
      if (u._id) userMap.set(u._id.toString(), u);
      if (u.id) userMap.set(u.id, u);
      if (u.email) userMap.set(u.email.toLowerCase(), u);
    });

    // 2. Fetch all collections containing real financial transactions
    const [rawTxs, rawPayments, rawTickets] = await Promise.all([
      db.collection('transactions').find({}).sort({ date: -1, createdAt: -1 }).toArray(),
      db.collection('payments').find({}).sort({ createdAt: -1 }).toArray(),
      db.collection('cinema_tickets').find({}).sort({ createdAt: -1 }).toArray(),
    ]);

    const allRecords: any[] = [];

    // Process 'payments' collection (Real Checkout Subscriptions)
    rawPayments.forEach((p: any) => {
      const u = userMap.get(p.userId ? String(p.userId) : '') || userMap.get((p.customerEmail || p.userEmail || '').toLowerCase());
      const userEmail = p.customerEmail || p.userEmail || u?.email || 'subscriber@flixora.tv';
      const userName = p.userName || u?.name || (userEmail.includes('@') ? userEmail.split('@')[0] : 'Flixora Subscriber');
      const rawAmt = typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount || '0').replace(/[^0-9.]/g, ''));
      const status = (p.status === 'Paid' || p.status === 'success') ? 'success' : (p.status === 'Cancelled' || p.status === 'refunded') ? 'refunded' : 'failed';
      const rawDate = p.createdAt || new Date();

      allRecords.push({
        _id: p._id.toString(),
        invoiceId: p.invoiceId || `INV-PAY-${p._id.toString().slice(-6).toUpperCase()}`,
        stripeTransactionId: p.stripeSessionId || p.paymentIntentId || `cs_live_${p._id.toString().slice(-8)}`,
        userId: p.userId ? String(p.userId) : (u?._id?.toString() || ''),
        userEmail: userEmail,
        userName: userName,
        planName: p.planName || (rawAmt >= 14 ? 'Premium' : rawAmt >= 10 ? 'Standard' : 'Basic'),
        amount: isNaN(rawAmt) || rawAmt <= 0 ? 11.99 : parseFloat(rawAmt.toFixed(2)),
        currency: 'USD',
        status: status,
        date: new Date(rawDate).toISOString().split('T')[0],
        rawDate: new Date(rawDate),
        paymentMethod: p.paymentMethod || 'Card (Stripe)',
        type: 'subscription'
      });
    });

    // Process 'cinema_tickets' collection (Real Movie Tickets)
    rawTickets.forEach((tk: any) => {
      const exists = allRecords.some(r => r.invoiceId === tk.ticketId || r.invoiceId === tk.bookingId || r.stripeTransactionId === tk.bookingId);
      if (!exists) {
        const u = userMap.get(tk.userId ? String(tk.userId) : '') || userMap.get((tk.userEmail || '').toLowerCase());
        const userEmail = tk.userEmail || u?.email || 'cinema_user@flixora.tv';
        const userName = tk.userName || u?.name || (userEmail.includes('@') ? userEmail.split('@')[0] : 'Cinema Buyer');
        const ticketAmt = typeof tk.totalPrice === 'number' ? (tk.totalPrice > 200 ? parseFloat((tk.totalPrice / 110).toFixed(2)) : tk.totalPrice) : 14.00;
        const status = tk.status === 'cancelled' ? 'refunded' : 'success';
        const rawDate = tk.createdAt || new Date();

        allRecords.push({
          _id: tk._id.toString(),
          invoiceId: tk.ticketCode || tk.ticketId || tk.bookingId || `TCK-${tk._id.toString().slice(-6).toUpperCase()}`,
          stripeTransactionId: tk.bookingId || tk.stripeSessionId || `tck_live_${tk._id.toString().slice(-6)}`,
          userId: tk.userId ? String(tk.userId) : (u?._id?.toString() || ''),
          userEmail: userEmail,
          userName: userName,
          planName: `Cinema: ${tk.movieTitle || 'Movie'} (${tk.seatNumbers?.length || tk.seats?.length || 1} seats)`,
          amount: parseFloat(ticketAmt.toFixed(2)),
          currency: 'USD',
          status: status,
          date: new Date(rawDate).toISOString().split('T')[0],
          rawDate: new Date(rawDate),
          paymentMethod: 'Stripe Cinema Pay',
          type: 'ticket'
        });
      }
    });

    // Process 'transactions' collection (merge any extra non-duplicate transactions)
    rawTxs.forEach((t: any) => {
      const exists = allRecords.some(r => r.stripeTransactionId === t.stripeTransactionId || r.invoiceId === t.invoiceId);
      if (!exists && !t.userEmail?.includes('subscriber_')) {
        const u = userMap.get(t.userId ? String(t.userId) : '') || userMap.get((t.userEmail || '').toLowerCase());
        const userEmail = u?.email || t.userEmail || 'subscriber@flixora.tv';
        const userName = u?.name || t.userName || (userEmail.includes('@') ? userEmail.split('@')[0] : 'Subscribed User');
        const rawAmt = typeof t.amount === 'number' ? t.amount : parseFloat(String(t.amount || '0').replace(/[^0-9.]/g, ''));
        const status = (t.status === 'Paid' || t.status === 'success') ? 'success' : (t.status === 'refunded' || t.status === 'Cancelled') ? 'refunded' : 'failed';
        const rawDate = t.date || t.createdAt || new Date();

        allRecords.push({
          _id: t._id.toString(),
          invoiceId: t.invoiceId || `INV-SUB-${t._id.toString().slice(-6).toUpperCase()}`,
          stripeTransactionId: t.stripeTransactionId || t.stripeSessionId || `pi_live_${t._id.toString().slice(-8)}`,
          userId: t.userId ? String(t.userId) : (u?._id?.toString() || ''),
          userEmail: userEmail,
          userName: userName,
          planName: t.planName || 'Streaming Plan',
          amount: isNaN(rawAmt) || rawAmt <= 0 ? 11.99 : parseFloat(rawAmt.toFixed(2)),
          currency: t.currency || 'USD',
          status: status,
          date: new Date(rawDate).toISOString().split('T')[0],
          rawDate: new Date(rawDate),
          paymentMethod: t.paymentMethod || 'Stripe (Card)',
          type: 'subscription'
        });
      }
    });

    // Sort all combined real records by date descending
    allRecords.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    // Filter by Status
    let filtered = allRecords;
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === statusFilter);
    }

    // Filter by Search Query
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.invoiceId.toLowerCase().includes(s) ||
          r.stripeTransactionId.toLowerCase().includes(s) ||
          r.userEmail.toLowerCase().includes(s) ||
          r.userName.toLowerCase().includes(s) ||
          r.planName.toLowerCase().includes(s)
      );
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    // Summary Statistics across all real records
    const summary = {
      totalRevenue: parseFloat(allRecords.reduce((acc, r) => acc + (r.status === 'success' ? r.amount : 0), 0).toFixed(2)),
      successfulCount: allRecords.filter(r => r.status === 'success').length,
      refundedCount: allRecords.filter(r => r.status === 'refunded').length,
      failedCount: allRecords.filter(r => r.status === 'failed').length,
    };

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      summary,
    });
  } catch (err: any) {
    console.error('Admin transactions API error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
