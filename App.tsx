import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar, { MiniSidebar } from './components/Sidebar';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import { Video } from './types';
import { getInitialVideos, searchVideosWithGemini } from './services/geminiService';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');

  useEffect(() => {
    // Initial load
    setVideos(getInitialVideos());
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      setVideos(getInitialVideos());
      setCurrentSearch('');
      return;
    }
    
    setLoading(true);
    setCurrentSearch(query);
    // Use Gemini to generate new video results based on the search query
    const results = await searchVideosWithGemini(query);
    setVideos(results);
    setLoading(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Navbar onMenuClick={toggleSidebar} onSearch={handleSearch} />
        
        <div className="flex pt-14">
          {/* Responsive Sidebar Logic */}
          <div className="hidden md:block">
            {sidebarOpen ? <Sidebar isOpen={true} /> : <MiniSidebar />}
          </div>
          <div className="block md:hidden">
             {/* Mobile bottom nav or simple hidden sidebar for now */}
          </div>

          <main 
            className={`flex-1 min-h-[calc(100vh-56px)] transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'}`}
          >
             <Routes>
               <Route path="/" element={
                 <div className="p-4 sm:p-6">
                    {/* Tags / Filters Row (Visual only) */}
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
                      {['All', 'Gaming', 'Music', 'Live', 'Mixes', 'React Routers', 'Computer programming', 'Podcasts', 'News', 'Recently uploaded', 'New to you'].map((tag, i) => (
                        <button 
                          key={tag}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-[#272727] hover:bg-[#3f3f3f] text-white'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                        <p className="text-[#aaa]">Gemini is dreaming up videos for "{currentSearch}"...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-8 gap-x-4">
                        {videos.map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                      </div>
                    )}
                 </div>
               } />
               <Route path="/watch/:id" element={
                 <VideoPlayer currentVideo={null} allVideos={videos} />
               } />
             </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
