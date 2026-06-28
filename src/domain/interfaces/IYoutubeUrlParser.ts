import type { ParsedYoutubeUrl } from '../models/Video';

export interface IYoutubeUrlParser {
  parseUrl(url: string): ParsedYoutubeUrl | null;
  parseMultiple(input: string): ParsedYoutubeUrl[];
}
