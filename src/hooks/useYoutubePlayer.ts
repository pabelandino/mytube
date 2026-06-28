import { useEffect, useRef, useCallback } from 'react';
import {
  YOUTUBE_PLAYER_SANDBOX,
  YOUTUBE_REFERRER_POLICY,
  buildEmbedUrl,
} from '../utils/constants';

const PLAYER_STATE_ENDED = 0;
const YOUTUBE_ORIGINS = new Set([
  'https://www.youtube.com',
  'https://www.youtube-nocookie.com',
]);

interface YoutubeMessagePayload {
  event?: string;
  info?: number | { playerState?: number };
}

function parseYoutubeMessage(data: unknown): YoutubeMessagePayload | null {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as YoutubeMessagePayload;
    } catch {
      return null;
    }
  }

  if (typeof data === 'object' && data !== null) {
    return data as YoutubeMessagePayload;
  }

  return null;
}

function isVideoEndedMessage(payload: YoutubeMessagePayload): boolean {
  if (payload.event === 'onStateChange' && payload.info === PLAYER_STATE_ENDED) {
    return true;
  }

  if (payload.event === 'infoDelivery' && typeof payload.info === 'object') {
    return payload.info.playerState === PLAYER_STATE_ENDED;
  }

  return false;
}

interface UseYoutubePlayerOptions {
  videoId: string | null;
  onVideoEnded: () => void;
}

export function useYoutubePlayer({ videoId, onVideoEnded }: UseYoutubePlayerOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onVideoEndedRef = useRef(onVideoEnded);

  onVideoEndedRef.current = onVideoEnded;

  const subscribeToPlayerEvents = useCallback(() => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) {
      return;
    }

    iframeWindow.postMessage(
      JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
      '*',
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!YOUTUBE_ORIGINS.has(event.origin)) {
        return;
      }

      const payload = parseYoutubeMessage(event.data);
      if (payload && isVideoEndedMessage(payload)) {
        onVideoEndedRef.current();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleIframeLoad = useCallback(() => {
    subscribeToPlayerEvents();
  }, [subscribeToPlayerEvents]);

  const embedUrl = videoId ? buildEmbedUrl(videoId) : null;

  return {
    iframeRef,
    embedUrl,
    handleIframeLoad,
    sandbox: YOUTUBE_PLAYER_SANDBOX,
    referrerPolicy: YOUTUBE_REFERRER_POLICY,
  };
}

export function preventExternalNavigation(event: React.SyntheticEvent): void {
  event.preventDefault();
  event.stopPropagation();
}
