export interface CinemaHall {
  id: string;
  name: string;
  district: string;
  address: string;
  distance: string;
  totalSeats: number;
  regularPrice: number;
  premiumPrice: number;
  features: string[];
}

export interface ShowtimePill {
  id: string;
  time: string;
  seatsAvailable: number;
  totalSeats: number;
  isFillingFast: boolean;
  isSoldOut: boolean;
}

export interface SeatInfo {
  id: string; // e.g. "A1", "F5"
  row: string; // e.g. "A"
  number: number; // 1..16
  type: 'regular' | 'premium';
  price: number;
  status: 'available' | 'selected' | 'booked' | 'held';
}

export const BANGLADESH_DISTRICTS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
];

export const CINEMA_HALLS_DATA: CinemaHall[] = [
  {
    id: 'hall-star-sks',
    name: 'Star Cineplex - SKS Tower',
    district: 'Dhaka',
    address: 'SKS Tower, Mohakhali, Dhaka 1212',
    distance: '2.4 km away',
    totalSeats: 128,
    regularPrice: 450,
    premiumPrice: 650,
    features: ['Dolby Atmos', 'VIP Recliners', '4K Laser Projection'],
  },
  {
    id: 'hall-star-bashundhara',
    name: 'Star Cineplex - Bashundhara City',
    district: 'Dhaka',
    address: 'Level 8, Bashundhara City Mall, Panthapath, Dhaka',
    distance: '4.1 km away',
    totalSeats: 144,
    regularPrice: 450,
    premiumPrice: 650,
    features: ['3D Silver Screen', 'Dolby Digital 7.1'],
  },
  {
    id: 'hall-blockbuster',
    name: 'Blockbuster Cinemas - Jamuna Future Park',
    district: 'Dhaka',
    address: 'Level 5, Jamuna Future Park, Pragati Sarani, Dhaka',
    distance: '5.8 km away',
    totalSeats: 160,
    regularPrice: 400,
    premiumPrice: 600,
    features: ['IMAX 3D', 'Dolby Atmos', 'Premium Lounge'],
  },
  {
    id: 'hall-lion',
    name: 'Lion Cinema - Keraniganj',
    district: 'Dhaka',
    address: 'Lion Shoppers World, Kadamtali, Keraniganj, Dhaka',
    distance: '9.2 km away',
    totalSeats: 120,
    regularPrice: 350,
    premiumPrice: 500,
    features: ['4K Digital', 'Full AC'],
  },
  {
    id: 'hall-silver-screen',
    name: 'Silver Screen Cineplex',
    district: 'Chattogram',
    address: 'Finlay Square, 2 No. Gate, Nasirabad, Chattogram',
    distance: '3.1 km away',
    totalSeats: 112,
    regularPrice: 450,
    premiumPrice: 650,
    features: ['Dolby Atmos', 'Executive Seating'],
  },
  {
    id: 'hall-grand-sylhet',
    name: 'Grand Sylhet Movie Theater',
    district: 'Sylhet',
    address: 'Grand Sylhet Hotel & Resort, Airport Road, Sylhet',
    distance: '1.8 km away',
    totalSeats: 96,
    regularPrice: 400,
    premiumPrice: 600,
    features: ['4K Projection', 'VIP Service'],
  },
  {
    id: 'hall-alliance-rajshahi',
    name: 'Alliance Cineplex',
    district: 'Rajshahi',
    address: 'Theme Omra Plaza, Shaheb Bazar, Rajshahi',
    distance: '2.0 km away',
    totalSeats: 100,
    regularPrice: 350,
    premiumPrice: 500,
    features: ['Dolby Digital 7.1', 'Air Conditioned'],
  },
  {
    id: 'hall-liberty-khulna',
    name: 'Liberty Cineplex',
    district: 'Khulna',
    address: 'KDA Avenue, Commercial Area, Khulna',
    distance: '2.5 km away',
    totalSeats: 110,
    regularPrice: 350,
    premiumPrice: 500,
    features: ['Full HD Projection', 'Snack Bar'],
  },
];

export function generateDatesList(days = 10) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dateStr = d.toISOString().split('T')[0];
    dates.push({
      dateStr,
      dayName,
      monthDay,
      isToday: i === 0,
    });
  }
  return dates;
}

export function generateParabolicSeats(hall: CinemaHall, bookedSeats: string[] = []): SeatInfo[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 16;
  const premiumRows = ['F', 'G', 'H'];
  const seats: SeatInfo[] = [];

  rows.forEach((rowLetter) => {
    const isPremium = premiumRows.includes(rowLetter);
    const rowPrice = isPremium ? hall.premiumPrice : hall.regularPrice;

    for (let num = 1; num <= seatsPerRow; num++) {
      const seatId = `${rowLetter}${num}`;
      const isBooked = bookedSeats.includes(seatId);

      seats.push({
        id: seatId,
        row: rowLetter,
        number: num,
        type: isPremium ? 'premium' : 'regular',
        price: rowPrice,
        status: isBooked ? 'booked' : 'available',
      });
    }
  });

  return seats;
}
