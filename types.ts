import React from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  duration: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}