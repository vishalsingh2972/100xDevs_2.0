import z from 'zod';

//used by backend
export const signUpInput = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(5),
});

export const signInInput = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string(),
});

//used by frontend ~ always in sync with backend
export type SignUpInput = z.infer<typeof signUpInput>;
export type SignInInput = z.infer<typeof signInInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;