import {
  useVideoStore,
  selectSidebarVideos,
  selectSidebarTotalPages,
} from '../../store/useVideoStore';
import { VideoListItem } from './VideoListItem';
import { SidebarPagination, SIDEBAR_PAGE_SIZE } from './SidebarPagination';

export function VideoSidebar() {
  const videos = useVideoStore((state) => state.videos);
  const currentVideoId = useVideoStore((state) => state.currentVideoId);
  const upcomingQueue = useVideoStore((state) => state.upcomingQueue);
  const sidebarPage = useVideoStore((state) => state.sidebarPage);
  const playVideo = useVideoStore((state) => state.playVideo);
  const setSidebarPage = useVideoStore((state) => state.setSidebarPage);

  const sidebarVideoIds = selectSidebarVideos(upcomingQueue, sidebarPage, SIDEBAR_PAGE_SIZE);
  const totalPages = selectSidebarTotalPages(upcomingQueue, SIDEBAR_PAGE_SIZE);
  const globalIndexOffset = sidebarPage * SIDEBAR_PAGE_SIZE;

  return (
    <aside className="w-full max-w-[402px] shrink-0 max-[1100px]:max-w-full">
      <header className="mb-3">
        <h2 className="mb-1 text-base font-semibold text-[#f1f1f1]">Siguientes videos</h2>
        <span className="text-xs text-[#aaa]">
          {upcomingQueue.length} en cola · {videos.length} total
        </span>
      </header>

      {upcomingQueue.length === 0 ? (
        <div className="rounded-xl bg-[#181818] p-4 text-sm leading-relaxed text-[#aaa]">
          {videos.length <= 1 ? (
            <p className="m-0">Agrega más videos con el botón + para ver sugerencias aquí.</p>
          ) : (
            <p className="m-0">No hay más videos en la cola.</p>
          )}
        </div>
      ) : (
        <>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {sidebarVideoIds.map((videoId, localIndex) => (
              <li key={videoId}>
                <VideoListItem
                  videoId={videoId}
                  index={globalIndexOffset + localIndex}
                  isActive={videoId === currentVideoId}
                  onPlay={playVideo}
                />
              </li>
            ))}
          </ul>

          <SidebarPagination
            currentPage={sidebarPage}
            totalPages={totalPages}
            onPageChange={setSidebarPage}
          />
        </>
      )}
    </aside>
  );
}
