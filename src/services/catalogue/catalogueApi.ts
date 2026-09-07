import { CatalogueMovie, CatalogueResult, CustomCollection } from "@/types/catalogue";

export async function getCatalogueMovies(
  query = "",
  genre = "All",
  page = 1,
  maturity = "All",
  collection = "All",
  featured = false,
  hidden = false
): Promise<{ result: CatalogueResult; collections: CustomCollection[] }> {
  try {
    const params = new URLSearchParams({
      query,
      genre,
      page: page.toString(),
      maturity,
      collection,
      featured: featured ? "true" : "false",
      hidden: hidden ? "true" : "false",
    });

    const res = await fetch(`/api/admin/catalogue?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          result: data.result,
          collections: data.collections || [],
        };
      }
    }
  } catch (err) {
    console.error("getCatalogueMovies error:", err);
  }

  return {
    result: {
      movies: [],
      totalResults: 0,
      totalPages: 1,
      featuredHeroCount: 0,
      hiddenCount: 0,
      publishedCount: 0,
    },
    collections: [],
  };
}

export async function updateMovieMetadata(movieId: string, updates: Partial<CatalogueMovie>) {
  const res = await fetch('/api/admin/catalogue', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId, updates }),
  });
  return res.json();
}

export async function addCustomMovie(movieData: Partial<CatalogueMovie>) {
  const res = await fetch('/api/admin/catalogue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData),
  });
  return res.json();
}

export async function createCustomCollection(collectionData: { name: string; tag: string; description: string; movieIds: string[] }) {
  const res = await fetch('/api/admin/catalogue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create_collection', ...collectionData }),
  });
  return res.json();
}

export async function deleteCatalogueMovie(id: string) {
  const res = await fetch(`/api/admin/catalogue?id=${id}`, {
    method: 'DELETE',
  });
  return res.json();
}