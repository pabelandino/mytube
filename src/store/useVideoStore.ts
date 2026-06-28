import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Video } from '../domain/models/Video';
import { videoQueueService } from '../domain/services/VideoQueueService';
import { youtubeUrlParser } from '../domain/services/YoutubeUrlParser';
import { STORAGE_KEY } from '../utils/constants';

interface VideoStoreState {
  videos: Video[];
  currentVideoId: string | null;
  upcomingQueue: string[];
  sidebarPage: number;
  isHydrated: boolean;
}

interface VideoStoreActions {
  addVideosFromInput: (input: string) => { added: number; invalid: number };
  playVideo: (videoId: string) => void;
  playNextRandom: () => void;
  onVideoEnded: () => void;
  setSidebarPage: (page: number) => void;
  removeVideo: (videoId: string) => void;
  initializePlayback: () => void;
  setHydrated: (value: boolean) => void;
}

type VideoStore = VideoStoreState & VideoStoreActions;

function createVideoFromParsed(videoId: string, url: string): Video {
  return {
    id: videoId,
    url,
    addedAt: Date.now(),
  };
}

function rebuildUpcomingQueue(
  videos: Video[],
  currentVideoId: string | null,
): string[] {
  const allIds = videos.map((video) => video.id);
  return videoQueueService.buildUpcomingQueue(allIds, currentVideoId);
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],
      currentVideoId: null,
      upcomingQueue: [],
      sidebarPage: 0,
      isHydrated: false,

      setHydrated: (value) => set({ isHydrated: value }),

      initializePlayback: () => {
        const { videos, currentVideoId } = get();

        if (videos.length === 0) {
          set({ currentVideoId: null, upcomingQueue: [] });
          return;
        }

        const isCurrentValid =
          currentVideoId !== null && videos.some((video) => video.id === currentVideoId);

        const nextCurrentId = isCurrentValid
          ? currentVideoId
          : videoQueueService.pickRandomVideo(videos.map((video) => video.id));

        set({
          currentVideoId: nextCurrentId,
          upcomingQueue: rebuildUpcomingQueue(videos, nextCurrentId),
          sidebarPage: 0,
        });
      },

      addVideosFromInput: (input) => {
        const parsedUrls = youtubeUrlParser.parseMultiple(input);
        const { videos } = get();
        const existingIds = new Set(videos.map((video) => video.id));

        const newVideos = parsedUrls
          .filter((parsed) => !existingIds.has(parsed.videoId))
          .map((parsed) => createVideoFromParsed(parsed.videoId, parsed.originalUrl));

        if (newVideos.length === 0) {
          const candidateCount = input
            .split(/[\n,;]+/)
            .map((line) => line.trim())
            .filter(Boolean).length;

          return {
            added: 0,
            invalid: candidateCount - parsedUrls.length,
          };
        }

        const updatedVideos = [...videos, ...newVideos];
        const { currentVideoId } = get();

        let nextCurrentId = currentVideoId;
        if (!nextCurrentId) {
          nextCurrentId = videoQueueService.pickRandomVideo(
            updatedVideos.map((video) => video.id),
          );
        }

        set({
          videos: updatedVideos,
          currentVideoId: nextCurrentId,
          upcomingQueue: rebuildUpcomingQueue(updatedVideos, nextCurrentId),
          sidebarPage: 0,
        });

        const candidateCount = input
          .split(/[\n,;]+/)
          .map((line) => line.trim())
          .filter(Boolean).length;

        return {
          added: newVideos.length,
          invalid: candidateCount - parsedUrls.length,
        };
      },

      playVideo: (videoId) => {
        const { videos } = get();
        const selectedVideo = videos.find((video) => video.id === videoId);

        if (!selectedVideo) {
          return;
        }

        const reorderedVideos = [
          selectedVideo,
          ...videos.filter((video) => video.id !== videoId),
        ];

        set({
          videos: reorderedVideos,
          currentVideoId: videoId,
          upcomingQueue: rebuildUpcomingQueue(reorderedVideos, videoId),
          sidebarPage: 0,
        });
      },

      playNextRandom: () => {
        const { videos, currentVideoId, upcomingQueue } = get();

        if (videos.length === 0) {
          return;
        }

        const nextFromQueue = upcomingQueue.find((id) => id !== currentVideoId);
        const nextVideoId =
          nextFromQueue ??
          videoQueueService.pickRandomVideo(
            videos.map((video) => video.id),
            currentVideoId,
          );

        if (!nextVideoId) {
          return;
        }

        const remainingQueue = upcomingQueue.filter((id) => id !== nextVideoId);
        const reshuffledQueue =
          remainingQueue.length > 0
            ? remainingQueue
            : rebuildUpcomingQueue(videos, nextVideoId);

        set({
          currentVideoId: nextVideoId,
          upcomingQueue: reshuffledQueue,
          sidebarPage: 0,
        });
      },

      onVideoEnded: () => {
        get().playNextRandom();
      },

      setSidebarPage: (page) => set({ sidebarPage: page }),

      removeVideo: (videoId) => {
        const { videos, currentVideoId } = get();
        const updatedVideos = videos.filter((video) => video.id !== videoId);

        if (updatedVideos.length === 0) {
          set({
            videos: [],
            currentVideoId: null,
            upcomingQueue: [],
            sidebarPage: 0,
          });
          return;
        }

        let nextCurrentId = currentVideoId;
        if (currentVideoId === videoId) {
          nextCurrentId = videoQueueService.pickRandomVideo(
            updatedVideos.map((video) => video.id),
          );
        }

        set({
          videos: updatedVideos,
          currentVideoId: nextCurrentId,
          upcomingQueue: rebuildUpcomingQueue(updatedVideos, nextCurrentId),
          sidebarPage: 0,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        videos: state.videos,
        currentVideoId: state.currentVideoId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.initializePlayback();
        state?.setHydrated(true);
      },
    },
  ),
);

export function selectVideoById(videos: Video[], videoId: string | null): Video | undefined {
  if (!videoId) {
    return undefined;
  }

  return videos.find((video) => video.id === videoId);
}

export function selectSidebarVideos(
  upcomingQueue: string[],
  page: number,
  pageSize: number,
): string[] {
  return videoQueueService.paginate(upcomingQueue, page, pageSize);
}

export function selectSidebarTotalPages(upcomingQueue: string[], pageSize: number): number {
  return videoQueueService.getTotalPages(upcomingQueue.length, pageSize);
}
