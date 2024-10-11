import z from 'zod';

//used by my backend
export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  name: z.string().optional()
});

export const signInInput = z.object({
  email: z.string().email(),
  password: z.string().min(5)
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string()
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string()
});

//used by my frontend ~ will always be in sync with the backend
export type SignUpInput = z.infer<typeof signUpInput>;
export type SignInInput = z.infer<typeof signInInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;