import { Header } from './components/layout/Header';
import { YoutubePlayer } from './components/player/YoutubePlayer';
import { VideoSidebar } from './components/sidebar/VideoSidebar';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-[1720px] flex-1 gap-6 p-6 max-[1100px]:flex-col max-[1100px]:gap-4 max-[1100px]:p-4">
        <div className="min-w-0 flex-1">
          <YoutubePlayer />
        </div>
        <VideoSidebar />
      </main>
    </div>
  );
}

export default App;
