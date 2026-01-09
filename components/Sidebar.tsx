import React from 'react';
import { Home, Compass, MonitorPlay, Clock, ThumbsUp, ChevronRight, User, Gamepad2, Film, Flame, Music2, Trophy } from 'lucide-react';
import { SidebarItemProps } from '../types';

interface SidebarProps {
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, isCollapsed }) => {
  return (
    <div 
      className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-1 py-4' : 'gap-5 px-3 py-2'} 
      rounded-lg cursor-pointer hover:bg-[#272727] transition-colors ${isActive ? 'bg-[#272727]' : ''}`}
    >
      <div className={isActive ? 'text-white' : 'text-white'}>{icon}</div>
      <span className={`text-[10px] sm:text-sm ${isCollapsed ? 'truncate w-full text-center' : ''} ${!isCollapsed ? 'text-sm font-medium' : ''}`}>
        {label}
      </span>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  if (!isOpen) return null; // Mobile behavior handled by layout usually, but here we just hide if strict toggle

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-[#0f0f0f] overflow-y-auto px-3 py-2 hidden md:block hover:overflow-y-auto [&::-webkit-scrollbar]:w-2">
      <div className="space-y-1 pb-4 border-b border-[#303030]">
        <SidebarItem icon={<Home className="w-6 h-6" />} label="Home" isActive={true} />
        <SidebarItem icon={<MonitorPlay className="w-6 h-6" />} label="Shorts" />
        <SidebarItem icon={<Compass className="w-6 h-6" />} label="Subscriptions" />
      </div>

      <div className="space-y-1 py-4 border-b border-[#303030]">
        <h3 className="px-3 mb-2 text-base font-medium flex items-center">
          You <ChevronRight className="w-4 h-4 ml-1" />
        </h3>
        <SidebarItem icon={<User className="w-6 h-6" />} label="Your channel" />
        <SidebarItem icon={<Clock className="w-6 h-6" />} label="History" />
        <SidebarItem icon={<MonitorPlay className="w-6 h-6" />} label="Your videos" />
        <SidebarItem icon={<Clock className="w-6 h-6" />} label="Watch later" />
        <SidebarItem icon={<ThumbsUp className="w-6 h-6" />} label="Liked videos" />
      </div>

      <div className="space-y-1 py-4 border-b border-[#303030]">
        <h3 className="px-3 mb-2 text-base font-medium">Explore</h3>
        <SidebarItem icon={<Flame className="w-6 h-6" />} label="Trending" />
        <SidebarItem icon={<Music2 className="w-6 h-6" />} label="Music" />
        <SidebarItem icon={<Gamepad2 className="w-6 h-6" />} label="Gaming" />
        <SidebarItem icon={<Film className="w-6 h-6" />} label="Movies" />
        <SidebarItem icon={<Trophy className="w-6 h-6" />} label="Sports" />
      </div>

       <div className="px-3 py-4 text-xs text-[#aaa] space-y-2">
        <p>About Press Copyright</p>
        <p>Contact us Creators</p>
        <p>Advertise Developers</p>
        <br />
        <p>Terms Privacy Policy & Safety</p>
        <p>How YouTube works</p>
        <p>Test new features</p>
        <p className="mt-2 text-[#717171]">© 2025 GeminiTube LLC</p>
      </div>
    </aside>
  );
};

// Mini sidebar for collapsed state
export const MiniSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[72px] bg-[#0f0f0f] hidden sm:flex flex-col items-center py-2 z-40">
        <SidebarItem icon={<Home className="w-6 h-6" />} label="Home" isCollapsed isActive />
        <SidebarItem icon={<MonitorPlay className="w-6 h-6" />} label="Shorts" isCollapsed />
        <SidebarItem icon={<Compass className="w-6 h-6" />} label="Subscriptions" isCollapsed />
        <SidebarItem icon={<User className="w-6 h-6" />} label="You" isCollapsed />
    </aside>
  )
}

export default Sidebar;
