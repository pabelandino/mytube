import { useYoutubePlayer, preventExternalNavigation } from '../../hooks/useYoutubePlayer';
import { useVideoStore, selectVideoById } from '../../store/useVideoStore';
import { MyTubeLogo } from '../ui/MyTubeLogo';

export function YoutubePlayer() {
  const currentVideoId = useVideoStore((state) => state.currentVideoId);
  const videos = useVideoStore((state) => state.videos);
  const onVideoEnded = useVideoStore((state) => state.onVideoEnded);

  const currentVideo = selectVideoById(videos, currentVideoId);

  const { iframeRef, embedUrl, handleIframeLoad, sandbox, referrerPolicy } = useYoutubePlayer({
    videoId: currentVideoId,
    onVideoEnded,
  });

  if (!currentVideoId || !currentVideo || !embedUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-[#181818]">
        <div className="text-center text-[#aaa]">
          <MyTubeLogo size={64} className="mx-auto opacity-60" />
          <h2 className="mb-2 mt-4 text-xl font-semibold text-[#f1f1f1]">No hay videos todavía</h2>
          <p className="m-0 text-sm">Haz clic en el botón + para agregar enlaces de YouTube</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black before:pointer-events-auto before:absolute before:inset-x-0 before:top-0 before:z-[3] before:h-12 before:content-[''] after:pointer-events-auto after:absolute after:bottom-0 after:left-0 after:z-[3] after:h-[60px] after:w-[28%] after:content-['']">
        <iframe
          key={currentVideoId}
          ref={iframeRef}
          className="h-full w-full border-none"
          src={embedUrl}
          title={`Reproduciendo video ${currentVideo.id}`}
          sandbox={sandbox}
          referrerPolicy={referrerPolicy}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={false}
          onLoad={handleIframeLoad}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-transparent"
          onClick={preventExternalNavigation}
          onContextMenu={preventExternalNavigation}
          title="Los enlaces externos están bloqueados"
          aria-hidden="true"
        />
      </div>

      <div className="mt-3">
        <h2 className="mb-2 text-xl font-semibold leading-snug text-[#f1f1f1]">
          Video {currentVideo.id}
        </h2>
        <div className="mb-3 flex items-center gap-2 text-sm text-[#aaa]">
          <span className="font-medium text-[#f1f1f1]">MyTube Library</span>
          <span>•</span>
          <span>{videos.length} videos en biblioteca</span>
        </div>
        <div className="rounded-xl bg-[#272727] px-4 py-3 text-sm leading-relaxed text-[#f1f1f1]">
          <p className="m-0">
            Reproducción segura embebida. Los enlaces externos y ventanas emergentes están
            bloqueados para mantenerte en MyTube.
          </p>
          <a
            href={currentVideo.url}
            className="hidden"
            onClick={preventExternalNavigation}
            tabIndex={-1}
            aria-hidden="true"
          >
            {currentVideo.url}
          </a>
        </div>
      </div>
    </section>
  );
}
