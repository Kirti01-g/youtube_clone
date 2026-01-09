import React, { useState } from 'react';
import { Menu, Search, Mic, Video, Bell, User, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate('/'); // Go back to home/feed to show results
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-[#272727] rounded-full transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <div 
          className="flex items-center gap-1 cursor-pointer" 
          onClick={() => {
            setSearchQuery('');
            onSearch(''); // Reset
            navigate('/');
          }}
        >
          <div className="bg-red-600 p-1 rounded-lg">
            <MonitorPlay className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter hidden sm:block">GeminiTube</span>
        </div>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="hidden sm:flex flex-1 max-w-[600px] items-center ml-10"
      >
        <div className="flex w-full">
          <div className="flex w-full relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#121212] border border-[#303030] rounded-l-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-[#222222] border border-l-0 border-[#303030] px-5 rounded-r-full hover:bg-[#303030] transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <button type="button" className="ml-4 p-2 bg-[#181818] hover:bg-[#303030] rounded-full transition-colors">
          <Mic className="w-5 h-5 text-white" />
        </button>
      </form>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="hidden sm:block p-2 hover:bg-[#272727] rounded-full">
          <Video className="w-6 h-6 text-white" />
        </button>
        <button className="hidden sm:block p-2 hover:bg-[#272727] rounded-full">
          <Bell className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-[#272727] rounded-full sm:hidden">
            <Search className="w-6 h-6 text-white" />
        </button>
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer">
          G
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
