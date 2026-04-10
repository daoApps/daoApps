export interface SocialProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  tags: string[];
  location: string;
  online: boolean;
  followers: number;
  following: number;
  mutualFriends: number;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: number;
  liked: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
  group: 'family' | 'colleague' | 'other';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  message: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Notification {
  id: string;
  type: 'system' | 'interaction' | 'message';
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

export interface MeetingRoom {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  participants: MeetingParticipant[];
  startTime: number;
  duration: number;
  isRecording: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
}

export interface MeetingParticipant {
  userId: string;
  userName: string;
  userAvatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
}
