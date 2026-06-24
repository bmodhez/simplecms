export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  published: boolean;
  categoryId?: string | null;
  category?: Category | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  customCss?: string | null;
  customJs?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPosts: number;
  totalPages: number;
  totalCategories: number;
  publishedPosts: number;
  draftPosts: number;
  recentPosts: Post[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
