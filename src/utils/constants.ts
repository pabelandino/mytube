export const APP_NAME = 'MyTube';
export const STORAGE_KEY = 'mytube-videos';
export const SIDEBAR_PAGE_SIZE = 12;

export const YOUTUBE_EMBED_BASE = 'https://www.youtube-nocookie.com/embed';
export const YOUTUBE_THUMBNAIL_BASE = 'https://img.youtube.com/vi';

export const YOUTUBE_PLAYER_SANDBOX = 'allow-scripts allow-same-origin allow-presentation';
export const YOUTUBE_REFERRER_POLICY = 'strict-origin-when-cross-origin' as const;

export function buildEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    fs: '0',
    disablekb: '1',
    playsinline: '1',
    enablejsapi: '1',
    origin: window.location.origin,
  });

  return `${YOUTUBE_EMBED_BASE}/${videoId}?${params.toString()}`;
}

export function buildThumbnailUrl(videoId: string): string {
  return `${YOUTUBE_THUMBNAIL_BASE}/${videoId}/mqdefault.jpg`;
}
