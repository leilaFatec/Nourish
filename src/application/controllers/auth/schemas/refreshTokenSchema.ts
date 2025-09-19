import  z  from 'zod';

export const refreshTokenSchema = z.object({  
  refreshToken: z.string().min(1, '"refreshToken" is required'),  
});

export type refreshTokenBody= z.infer<typeof refreshTokenSchema>;
