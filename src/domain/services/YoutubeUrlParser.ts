import type { IYoutubeUrlParser } from '../interfaces/IYoutubeUrlParser';
import type { ParsedYoutubeUrl } from '../models/Video';

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
  /youtube\.com\/embed\/([\w-]{11})/,
  /youtube\.com\/shorts\/([\w-]{11})/,
  /youtube\.com\/live\/([\w-]{11})/,
];

export class YoutubeUrlParser implements IYoutubeUrlParser {
  parseUrl(rawUrl: string): ParsedYoutubeUrl | null {
    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) {
      return null;
    }

    for (const pattern of YOUTUBE_PATTERNS) {
      const match = trimmedUrl.match(pattern);
      if (match?.[1]) {
        return {
          videoId: match[1],
          originalUrl: trimmedUrl,
        };
      }
    }

    return null;
  }

  parseMultiple(input: string): ParsedYoutubeUrl[] {
    const candidates = input
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const uniqueById = new Map<string, ParsedYoutubeUrl>();

    for (const candidate of candidates) {
      const parsed = this.parseUrl(candidate);
      if (parsed && !uniqueById.has(parsed.videoId)) {
        uniqueById.set(parsed.videoId, parsed);
      }
    }

    return Array.from(uniqueById.values());
  }
}

export const youtubeUrlParser = new YoutubeUrlParser();
