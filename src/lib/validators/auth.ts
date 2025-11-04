import { z } from 'zod';

export const loginRequestSchema = z.object({
  login: z
    .string({ required_error: 'Informe o login.' })
    .min(3, 'O login deve ter pelo menos 3 caracteres.')
    .max(255, 'O login deve ter no máximo 255 caracteres.'),
  password: z
    .string({ required_error: 'Informe a senha.' })
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(255, 'A senha deve ter no máximo 255 caracteres.'),
});

export type LoginRequestInput = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    login: z.string().min(3).max(255),
    nome: z.string().min(2).max(255),
    tecnico: z
      .object({
        idTecnico: z.number().int(),
        email: z.string().email().max(255).nullable(),
        celular: z.string().max(30).nullable(),
      })
      .strict(),
  }),
  tokenType: z.enum(['Bearer']),
  token: z.string().min(2),
  refreshToken: z.string().min(2).optional(),
  expiresIn: z.number().int().min(1).optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
