export interface CatalogueMovie {
    id: string;
    title: string;
    rating: number;
    year: number;
    genres: string[];
    posterUrl: string;
}

export interface CatalogueResult {
    movies: CatalogueMovie[];
    totalResults: number;
    totalPages: number;
}

