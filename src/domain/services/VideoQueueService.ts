import type { IVideoQueueService } from '../interfaces/IVideoQueueService';

export class VideoQueueService implements IVideoQueueService {
  shuffleQueue(videoIds: string[]): string[] {
    const shuffled = [...videoIds];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
  }

  buildUpcomingQueue(allVideoIds: string[], currentVideoId: string | null): string[] {
    const remainingIds = currentVideoId
      ? allVideoIds.filter((id) => id !== currentVideoId)
      : [...allVideoIds];

    return this.shuffleQueue(remainingIds);
  }

  moveToFront(queue: string[], videoId: string): string[] {
    const filteredQueue = queue.filter((id) => id !== videoId);
    return [videoId, ...filteredQueue];
  }

  pickRandomVideo(videoIds: string[], excludeId?: string | null): string | null {
    const candidates = excludeId
      ? videoIds.filter((id) => id !== excludeId)
      : videoIds;

    if (candidates.length === 0) {
      return videoIds[0] ?? null;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex] ?? null;
  }

  paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const startIndex = page * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }

  getTotalPages(itemCount: number, pageSize: number): number {
    if (itemCount === 0) {
      return 1;
    }

    return Math.ceil(itemCount / pageSize);
  }
}

export const videoQueueService = new VideoQueueService();
