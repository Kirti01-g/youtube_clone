import { GoogleGenAI, Type } from "@google/genai";
import { Video } from "../types";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Building a Clone of YouTube in 1 Hour",
    description: "In this video, we attempt the impossible: rebuilding the frontend of a major video platform using React and Tailwind CSS in record time.",
    thumbnailUrl: "https://picsum.photos/seed/tech1/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    channelName: "Code Master",
    channelAvatar: "https://picsum.photos/seed/avatar1/100/100",
    views: "1.2M views",
    uploadedAt: "2 days ago",
    duration: "12:45"
  },
  {
    id: "2",
    title: "Top 10 Travel Destinations for 2025",
    description: "Join us as we explore the most breathtaking locations you need to visit this year. From mountains to beaches, we cover it all.",
    thumbnailUrl: "https://picsum.photos/seed/travel2/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    channelName: "Wanderlust",
    channelAvatar: "https://picsum.photos/seed/avatar2/100/100",
    views: "850K views",
    uploadedAt: "1 week ago",
    duration: "8:30"
  },
  {
    id: "3",
    title: "Satisfying Kinetic Sand ASMR",
    description: "Relax and unwind with the most satisfying kinetic sand cutting and squishing sounds. Headphones recommended!",
    thumbnailUrl: "https://picsum.photos/seed/asmr3/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    channelName: "Chill Vibes",
    channelAvatar: "https://picsum.photos/seed/avatar3/100/100",
    views: "3.4M views",
    uploadedAt: "3 days ago",
    duration: "15:00"
  },
  {
    id: "4",
    title: "How to Cook the Perfect Steak",
    description: "Gordon Ramsay hates this one trick! Learn how to get that perfect sear and medium-rare inside every single time.",
    thumbnailUrl: "https://picsum.photos/seed/food4/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    channelName: "Chef's Table",
    channelAvatar: "https://picsum.photos/seed/avatar4/100/100",
    views: "2.1M views",
    uploadedAt: "5 hours ago",
    duration: "10:15"
  },
  {
    id: "5",
    title: "Reviewing the New AI Gadget",
    description: "Is this the future of technology? We unbox and review the latest AI wearable that everyone is talking about.",
    thumbnailUrl: "https://picsum.photos/seed/gadget5/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    channelName: "Tech Trends",
    channelAvatar: "https://picsum.photos/seed/avatar5/100/100",
    views: "500K views",
    uploadedAt: "1 day ago",
    duration: "18:20"
  },
  {
    id: "6",
    title: "Lofi Hip Hop Radio - Beats to Relax/Study to",
    description: "24/7 streaming for your study needs. Chill beats and good vibes only.",
    thumbnailUrl: "https://picsum.photos/seed/lofi6/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    channelName: "Lofi Girl Clone",
    channelAvatar: "https://picsum.photos/seed/avatar6/100/100",
    views: "10M views",
    uploadedAt: "LIVE",
    duration: "LIVE"
  },
  {
    id: "7",
    title: "Why Cats Are Actually Aliens",
    description: "The evidence is overwhelming. In this documentary, we explore the truth about our feline friends.",
    thumbnailUrl: "https://picsum.photos/seed/cat7/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    channelName: "Conspiracy Theories",
    channelAvatar: "https://picsum.photos/seed/avatar7/100/100",
    views: "900K views",
    uploadedAt: "4 days ago",
    duration: "22:10"
  },
  {
    id: "8",
    title: "100 Days in Minecraft Hardcore",
    description: "Can I survive 100 days in the harshest environment? Watch to find out!",
    thumbnailUrl: "https://picsum.photos/seed/game8/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    channelName: "Gamer Pro",
    channelAvatar: "https://picsum.photos/seed/avatar8/100/100",
    views: "5.6M views",
    uploadedAt: "2 weeks ago",
    duration: "45:00"
  }
];

export const getInitialVideos = (): Video[] => {
  return MOCK_VIDEOS;
};

export const searchVideosWithGemini = async (query: string): Promise<Video[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 8 realistic video results for a video sharing platform search query: "${query}". 
      Make them diverse and engaging. Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              channelName: { type: Type.STRING },
              views: { type: Type.STRING },
              uploadedAt: { type: Type.STRING },
              duration: { type: Type.STRING },
              keywords: { type: Type.STRING, description: "A single keyword to use for fetching a relevant stock image" }
            },
            required: ["id", "title", "description", "channelName", "views", "uploadedAt", "duration", "keywords"],
          },
        },
      },
    });

    const data = JSON.parse(response.text);
    
    // Map the Gemini response to our Video interface, adding images
    return data.map((item: any, index: number) => ({
      ...item,
      id: `gemini-${Date.now()}-${index}`,
      thumbnailUrl: `https://picsum.photos/seed/${item.keywords}${index}/640/360`,
      channelAvatar: `https://picsum.photos/seed/${item.channelName}/100/100`,
      videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Fallback video for generated content
    }));

  } catch (error) {
    console.error("Gemini search failed:", error);
    return [];
  }
};

export const generateVideoComments = async (videoTitle: string): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 5 realistic user comments for a youtube video titled: "${videoTitle}". 
        Include a mix of funny, supportive, and critical comments.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        author: { type: Type.STRING },
                        text: { type: Type.STRING },
                        likes: { type: Type.INTEGER },
                        time: { type: Type.STRING },
                    }
                }
            }
        }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to generate comments", error);
    return [];
  }
}
