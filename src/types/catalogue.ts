export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-Y' | 'TV-PG' | 'TV-14' | 'TV-MA';

export interface CatalogueMovie {
  id: string;
  title: string;
  type: 'Movie' | 'TV Series';
  rating: number;
  year: number;
  genres: string[];
  posterUrl: string;
  backdropUrl?: string;
  streamUrl?: string;
  trailerUrl?: string;
  synopsis?: string;
  maturityRating: MaturityRating;
  isFeaturedHero: boolean;
  isHidden: boolean;
  collections?: string[];
  createdAt?: string;
}

export interface CatalogueResult {
  movies: CatalogueMovie[];
  totalResults: number;
  totalPages: number;
  featuredHeroCount: number;
  hiddenCount: number;
  publishedCount: number;
}

export interface CustomCollection {
  id: string;
  name: string;
  tag: string;
  description: string;
  movieIds: string[];
  createdAt: string;
}
