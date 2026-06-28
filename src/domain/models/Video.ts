export interface Video {
  id: string;
  url: string;
  addedAt: number;
}

export interface ParsedYoutubeUrl {
  videoId: string;
  originalUrl: string;
}
