import { getExploreMovies } from "@/data/explore/movies";
import { CatalogueResult } from "@/types/catalogue";

export async function getCatalogueMovies(
    query = "",
    genre = "All",
    page = 1,
): Promise<CatalogueResult> {
    const result = await getExploreMovies(query, genre, page);

    return {
        movies: result.movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            rating: movie.rating,
            year: movie.year,
            genres: movie.genres,
            posterUrl: movie.posterUrl,
        })),
        totalResults: result.totalResults,
        totalPages: result.totalPages,
    };
}