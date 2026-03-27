export interface CreateBlogPostInput {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;
