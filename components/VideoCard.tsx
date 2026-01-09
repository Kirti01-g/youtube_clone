import React from 'react';
import { Video } from '../types';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate(`/watch/${video.id}`);
  };

  return (
    <div 
      className="flex flex-col gap-2 cursor-pointer group"
      onClick={handleVideoClick}
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      
      <div className="flex gap-3 mt-1">
        <div className="flex-shrink-0">
          <img 
            src={video.channelAvatar} 
            alt={video.channelName} 
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="text-white font-semibold text-base line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
            {video.title}
          </h3>
          <div className="text-[#aaa] text-sm mt-1">
            <div className="hover:text-white transition-colors">{video.channelName}</div>
            <div className="flex items-center">
              <span>{video.views}</span>
              <span className="mx-1 text-[10px]">•</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
        </div>

        <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1">
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
