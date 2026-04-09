export interface ProfileData {
  username: string;
  fullName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  profilePic: string;
  recentPosts: Post[];
  growthData: { date: string; followers: number }[];
}

export interface Post {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  date: string;
  engagement: number;
}
