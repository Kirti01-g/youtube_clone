import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, User } from 'lucide-react';
import { Video, Comment } from '../types';
import { getInitialVideos, generateVideoComments } from '../services/geminiService';
import VideoCard from './VideoCard';

interface VideoPlayerProps {
  currentVideo: Video | null;
  allVideos: Video[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentVideo: propVideo, allVideos }) => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(propVideo);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    // If we have a propVideo matching the ID, use it. Otherwise find it in allVideos.
    let found = propVideo?.id === id ? propVideo : allVideos.find(v => v.id === id);
    
    // Fallback if not found (e.g. direct link load), just pick first or random for demo
    if (!found && allVideos.length > 0) {
        found = allVideos[0];
    }

    if (found) {
        setVideo(found);
        setComments([]); // Clear old comments
        fetchComments(found.title);
    }
  }, [id, propVideo, allVideos]);

  const fetchComments = async (title: string) => {
    setLoadingComments(true);
    const generated = await generateVideoComments(title);
    setComments(generated.map((c, i) => ({...c, id: `comment-${i}`, avatar: `https://picsum.photos/seed/${c.author}/50/50` })));
    setLoadingComments(false);
  };

  if (!video) return <div className="pt-20 text-center">Loading video...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 pt-6 max-w-[1800px] mx-auto w-full">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Video Player Container */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
          <video 
            className="w-full h-full object-contain"
            controls
            autoPlay
            poster={video.thumbnailUrl}
            src={video.videoUrl} 
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="mt-4">
          <h1 className="text-xl font-bold line-clamp-2">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-4">
            <div className="flex items-center gap-4">
              <img src={video.channelAvatar} alt={video.channelName} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-semibold text-base">{video.channelName}</h3>
                <p className="text-xs text-[#aaa]">1.2M subscribers</p>
              </div>
              <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors ml-2">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex bg-[#272727] rounded-full overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">25K</span>
                </button>
                <button className="px-4 py-2 hover:bg-[#3f3f3f] transition-colors">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors">
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Download</span>
              </button>
              
              <button className="p-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            className={`mt-4 bg-[#272727] rounded-xl p-3 cursor-pointer hover:bg-[#3f3f3f] transition-colors ${descriptionExpanded ? '' : 'h-28 overflow-hidden'}`}
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
          >
            <div className="flex gap-2 font-medium text-sm mb-1">
              <span>{video.views}</span>
              <span>{video.uploadedAt}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{video.description}</p>
            {!descriptionExpanded && <span className="font-medium text-sm mt-1 block">...more</span>}
            {descriptionExpanded && <span className="font-medium text-sm mt-4 block">Show less</span>}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 mb-10">
          <div className="flex items-center gap-8 mb-6">
            <h2 className="text-xl font-bold">{comments.length > 0 ? comments.length : '...'} Comments</h2>
            <div className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              Sort by
            </div>
          </div>

          {/* Add Comment Input */}
          <div className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-medium flex-shrink-0">G</div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full bg-transparent border-b border-[#303030] pb-1 focus:border-white focus:outline-none transition-colors text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button className="px-3 py-2 text-sm font-medium hover:bg-[#272727] rounded-full">Cancel</button>
                <button className="px-3 py-2 text-sm font-medium bg-[#3ea6ff] text-black rounded-full hover:bg-[#65b8ff]">Comment</button>
              </div>
            </div>
          </div>

          {loadingComments ? (
            <div className="text-center py-4 text-[#aaa]">Gemini is writing comments...</div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-white text-sm">@{comment.author.replace(/\s+/g, '').toLowerCase()}</span>
                      <span className="text-[#aaa]">{comment.time}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1">
                        <button className="flex items-center gap-1 p-1 hover:bg-[#272727] rounded-full">
                           <ThumbsUp className="w-3 h-3" />
                           <span className="text-xs text-[#aaa]">{comment.likes}</span>
                        </button>
                        <button className="p-1 hover:bg-[#272727] rounded-full"><ThumbsDown className="w-3 h-3" /></button>
                        <button className="text-xs font-medium hover:bg-[#272727] px-2 py-1 rounded-full">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Videos Sidebar */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-3">
        {allVideos.filter(v => v.id !== video.id).map((suggested) => (
          <div 
             key={suggested.id} 
             className="flex gap-2 cursor-pointer group"
             onClick={() => {
                window.scrollTo(0,0);
                // The router will handle the update via useParams
                // but we can manually navigate to ensure
                window.location.hash = `#/watch/${suggested.id}`;
             }}
           >
            <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
              <img src={suggested.thumbnailUrl} alt={suggested.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {suggested.duration}
              </div>
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <h4 className="font-medium text-sm line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
                {suggested.title}
              </h4>
              <div className="text-xs text-[#aaa]">
                <p>{suggested.channelName}</p>
                <div className="flex items-center gap-1">
                   <span>{suggested.views}</span>
                   <span>•</span>
                   <span>{suggested.uploadedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
