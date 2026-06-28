export interface IVideoQueueService {
  shuffleQueue(videoIds: string[]): string[];
  buildUpcomingQueue(allVideoIds: string[], currentVideoId: string | null): string[];
  moveToFront(queue: string[], videoId: string): string[];
  pickRandomVideo(videoIds: string[], excludeId?: string | null): string | null;
  paginate<T>(items: T[], page: number, pageSize: number): T[];
  getTotalPages(itemCount: number, pageSize: number): number;
}
