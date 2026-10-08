import albumsFile from "@/lib/data/blessing-albums.json";

export type BlessingAlbum = {
  slug: string;
  honoree: string;
  occasion: string;
  organizer: string;
  deadline?: string;
};

const ALBUMS = albumsFile.albums as BlessingAlbum[];

export function getAllAlbumSlugs(): string[] {
  return ALBUMS.map((album) => album.slug);
}

export function findAlbum(rawSlug: string): BlessingAlbum | null {
  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug).trim();
  } catch {
    return null;
  }
  return ALBUMS.find((album) => album.slug === slug) ?? null;
}
