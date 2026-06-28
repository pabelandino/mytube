import { SIDEBAR_PAGE_SIZE } from '../../utils/constants';

interface SidebarPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SidebarPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SidebarPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <nav
      className="mt-2 flex items-center justify-center gap-3 border-t border-[#272727] py-3"
      aria-label="Paginación de videos sugeridos"
    >
      <button
        type="button"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-[#272727] text-xl leading-none text-[#f1f1f1] hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Página anterior"
      >
        ‹
      </button>

      <span className="min-w-[120px] text-center text-[13px] text-[#aaa]">
        Página {currentPage + 1} de {totalPages}
      </span>

      <button
        type="button"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-[#272727] text-xl leading-none text-[#f1f1f1] hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Página siguiente"
      >
        ›
      </button>
    </nav>
  );
}

export { SIDEBAR_PAGE_SIZE };
