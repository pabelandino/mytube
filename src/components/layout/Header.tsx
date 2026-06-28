import { useState } from 'react';
import { APP_NAME } from '../../utils/constants';
import { AddVideosModal } from '../modal/AddVideosModal';
import { MyTubeLogo } from '../ui/MyTubeLogo';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[100] flex h-14 items-center justify-between border-b border-[#272727] bg-[#0f0f0f] px-4">
        <div className="flex min-w-[160px] items-center gap-2 max-md:min-w-0">
          <MyTubeLogo size={32} />
          <h1 className="m-0 text-xl font-bold tracking-tight text-white">{APP_NAME}</h1>
        </div>

        <div className="mx-10 flex flex-1 justify-center max-w-[720px] max-md:hidden">
          <div className="flex w-full max-w-[640px]">
            <input
              type="search"
              className="h-10 flex-1 rounded-l-full border border-[#303030] border-r-0 bg-[#121212] px-4 text-base text-[#f1f1f1] opacity-50 cursor-not-allowed"
              placeholder="Buscar en tu biblioteca..."
              disabled
              aria-label="Buscar (próximamente)"
            />
            <button
              type="button"
              className="flex h-10 w-16 cursor-not-allowed items-center justify-center rounded-r-full border border-[#303030] bg-[#222] text-white opacity-50"
              disabled
              aria-label="Buscar"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M20.87 20.17l-5.25-5.25a6.5 6.5 0 1 0-.88.88l5.25 5.25a.62.62 0 1 0 .88-.88zM11 16.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex min-w-[160px] items-center justify-end max-md:min-w-0">
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-white hover:bg-[#272727]"
            onClick={() => setIsModalOpen(true)}
            aria-label="Agregar videos"
            title="Agregar videos"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>
      </header>

      <AddVideosModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
