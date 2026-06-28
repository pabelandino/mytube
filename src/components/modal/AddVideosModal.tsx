import { useState } from 'react';
import { useVideoStore } from '../../store/useVideoStore';

interface AddVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVideosModal({ isOpen, onClose }: AddVideosModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const addVideosFromInput = useVideoStore((state) => state.addVideosFromInput);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = addVideosFromInput(inputValue);

    if (result.added === 0 && result.invalid === 0) {
      setFeedbackMessage('Agrega al menos un enlace de YouTube.');
      return;
    }

    const messages: string[] = [];

    if (result.added > 0) {
      messages.push(
        result.added === 1
          ? '1 video agregado correctamente.'
          : `${result.added} videos agregados correctamente.`,
      );
    }

    if (result.invalid > 0) {
      messages.push(
        result.invalid === 1
          ? '1 enlace no es válido.'
          : `${result.invalid} enlaces no son válidos.`,
      );
    }

    setFeedbackMessage(messages.join(' '));
    setInputValue('');
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="w-full max-w-[560px] rounded-xl bg-[#212121] p-6 text-[#f1f1f1] shadow-2xl"
        role="dialog"
        aria-labelledby="add-videos-title"
        aria-modal="true"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 id="add-videos-title" className="m-0 text-xl font-semibold">
            Agregar videos de YouTube
          </h2>
          <button
            type="button"
            className="cursor-pointer rounded-full border-none bg-transparent px-2 py-1 text-[1.75rem] leading-none text-[#aaa] hover:bg-[#383838] hover:text-white"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-sm leading-relaxed text-[#aaa]">
            Pega uno o más enlaces de YouTube. Puedes separarlos por líneas, comas o punto y coma.
          </p>

          <textarea
            className="box-border w-full resize-y rounded-lg border border-[#3f3f3f] bg-[#121212] p-3 font-inherit text-sm text-[#f1f1f1] focus:border-[#3ea6ff] focus:outline-none"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={
              'https://www.youtube.com/watch?v=...\nhttps://youtu.be/...\nhttps://www.youtube.com/watch?v=...'
            }
            rows={6}
            autoFocus
          />

          {feedbackMessage && (
            <p className="mt-3 text-sm text-[#3ea6ff]">{feedbackMessage}</p>
          )}

          <footer className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              className="cursor-pointer rounded-full border-none bg-transparent px-5 py-2.5 text-sm font-medium text-[#f1f1f1] hover:bg-[#383838]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-full border-none bg-white px-5 py-2.5 text-sm font-medium text-[#0f0f0f] hover:bg-[#e5e5e5]"
            >
              Agregar videos
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
