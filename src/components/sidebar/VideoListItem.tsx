import { buildThumbnailUrl } from '../../utils/constants';

interface VideoListItemProps {
  videoId: string;
  index: number;
  isActive: boolean;
  onPlay: (videoId: string) => void;
}

export function VideoListItem({ videoId, index, isActive, onPlay }: VideoListItemProps) {
  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer gap-2 rounded-lg border-none p-2 text-left transition-colors ${
        isActive ? 'bg-[#383838]' : 'bg-transparent hover:bg-[#272727]'
      }`}
      onClick={() => onPlay(videoId)}
      aria-current={isActive ? 'true' : undefined}
    >
      <div className="relative h-[94px] w-[168px] shrink-0 overflow-hidden rounded-lg bg-[#181818] max-[1100px]:h-[68px] max-[1100px]:w-[120px] max-md:h-[78px] max-md:w-[140px]">
        <img
          src={buildThumbnailUrl(videoId)}
          alt={`Miniatura del video ${videoId}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-1 top-1 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white">
          {index + 1}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="m-0 line-clamp-2 text-sm font-medium leading-snug text-[#f1f1f1]">
          Video {videoId}
        </h3>
        <p className="m-0 text-xs text-[#aaa]">MyTube Library</p>
        <p className="m-0 text-xs text-[#aaa]">Listo para reproducir</p>
      </div>
    </button>
  );
}
