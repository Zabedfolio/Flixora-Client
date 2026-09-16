'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#050505',
    color: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    paddingBottom: 15,
    marginBottom: 20,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF4C00',
    letterSpacing: 2,
  },
  subBrand: {
    fontSize: 8,
    color: '#888888',
    marginTop: 2,
  },
  ticketBadge: {
    backgroundColor: '#FF4C0020',
    borderColor: '#FF4C00',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ticketBadgeText: {
    fontSize: 9,
    color: '#FF4C00',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#0E0E0E',
    borderColor: '#1E1E1E',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  poster: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginRight: 20,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 9,
    color: '#888888',
    width: 80,
  },
  detailVal: {
    fontSize: 9,
    color: '#E4E4E7',
    fontWeight: 'bold',
  },
  seatsBox: {
    backgroundColor: '#141414',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seatsText: {
    fontSize: 16,
    color: '#FF4C00',
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#0E0E0E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    marginTop: 15,
  },
});

interface TicketPDFProps {
  ticket: {
    ticketId: string;
    movieTitle: string;
    moviePoster?: string;
    hallName: string;
    hallAddress: string;
    date: string;
    time: string;
    seatNumbers: string[];
    totalPrice: number;
    userName: string;
  };
  qrDataUrl?: string;
  posterDataUrl?: string;
}

export default function TicketPDFDocument({ ticket, qrDataUrl, posterDataUrl }: TicketPDFProps) {
  const posterSrc = posterDataUrl || ticket.moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>FLIXORA CINEMA</Text>
            <Text style={styles.subBrand}>Physical Ticket & Entry Pass</Text>
          </View>
          <View style={styles.ticketBadge}>
            <Text style={styles.ticketBadgeText}>{ticket.ticketId}</Text>
          </View>
        </View>

        {/* Movie Info Card */}
        <View style={styles.card}>
          {posterSrc ? (
            <Image style={styles.poster} src={posterSrc} />
          ) : null}

          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cinema Hall:</Text>
              <Text style={styles.detailVal}>{ticket.hallName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailVal}>{ticket.hallAddress}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Show Date:</Text>
              <Text style={styles.detailVal}>{ticket.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Showtime:</Text>
              <Text style={styles.detailVal}>{ticket.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer:</Text>
              <Text style={styles.detailVal}>{ticket.userName}</Text>
            </View>
          </View>
        </View>

        {/* Seats & Price Box */}
        <View style={styles.seatsBox}>
          <View>
            <Text style={{ fontSize: 9, color: '#888888', marginBottom: 2 }}>
              Reserved Seats ({ticket.seatNumbers.length}):
            </Text>
            <Text style={styles.seatsText}>{ticket.seatNumbers.join(', ')}</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 9, color: '#888888', marginBottom: 2 }}>
              Total Paid:
            </Text>
            <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' }}>
              {ticket.totalPrice} BDT
            </Text>
          </View>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrContainer}>
          {qrDataUrl ? (
            <Image style={{ width: 120, height: 120 }} src={qrDataUrl} />
          ) : null}
          <Text style={{ fontSize: 9, color: '#888888', marginTop: 8 }}>
            Scan at Hall Entrance for Automated Gate Check-in
          </Text>
          <Text style={{ fontSize: 8, color: '#FF4C00', marginTop: 4, fontWeight: 'bold' }}>
            {ticket.ticketId}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Flixora Digital Cinema Pass • Non-Transferable • Present this PDF or QR code at cinema gate
        </Text>
      </Page>
    </Document>
  );
}
