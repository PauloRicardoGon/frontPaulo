import { z } from 'zod';

const enderecoSchema = z
  .object({
    logradouro: z.string(),
    numero: z.string().nullable(),
    complemento: z.string().nullable(),
    bairro: z.string().nullable(),
    codigoCidade: z.number().int().nullable(),
    uf: z.string().min(2).max(2).nullable(),
    cep: z.string().regex(/^[0-9]{8}$/).nullable(),
  })
  .strict();

const enderecoNullableSchema = enderecoSchema.nullable();

export const clienteCreateSchema = z
  .object({
    razaoSocial: z.string().min(2).max(200),
    nomeFantasia: z.string().min(2).max(200).optional(),
    tipoPessoa: z.number().int().refine((value) => value === 0 || value === 1, {
      message: 'Tipo de pessoa inválido.',
    }),
    cpfCnpj: z.string().regex(/^[0-9]{11}$|^[0-9]{14}$/),
    email: z.string().email().max(255).nullable().optional(),
    telefone1: z.string().max(30).nullable().optional(),
    telefoneWhatsapp1: z.string().max(30).nullable().optional(),
    telefone2: z.string().max(30).nullable().optional(),
    telefoneWhatsapp2: z.string().max(30).nullable().optional(),
    celularWhatsapp: z.string().max(30).nullable().optional(),
    endereco: z
      .object({
        logradouro: z.string(),
        numero: z.string().nullable(),
        complemento: z.string().nullable(),
        bairro: z.string().nullable(),
        codigoCidade: z.number().int().nullable(),
        uf: z.string().min(2).max(2).nullable(),
        cep: z.string().regex(/^[0-9]{8}$/).nullable(),
      })
      .strict()
      .nullable()
      .optional(),
  })
  .strict();

export type ClienteCreateInput = z.infer<typeof clienteCreateSchema>;

export const clienteResponseSchema = z
  .object({
    idCliente: z.number().int(),
    razaoSocial: z.string(),
    nomeFantasia: z.string().nullable(),
    tipoPessoa: z.number().int().nullable(),
    cpfCnpj: z.string().regex(/^[0-9]{11}$|^[0-9]{14}$/),
    email: z.string().email().nullable(),
    telefone1: z.string().nullable(),
    telefoneWhatsapp1: z.string().nullable(),
    telefone2: z.string().nullable(),
    telefoneWhatsapp2: z.string().nullable(),
    celularWhatsapp: z.string().nullable(),
    endereco: enderecoNullableSchema,
    dataCadastro: z.string().datetime(),
    dataAtualizacao: z.string().datetime(),
  })
  .strict();

export const clientesListResponseSchema = z.array(
  z
    .object({
      idCliente: z.number().int(),
      razaoSocial: z.string(),
      cpfCnpj: z.string().regex(/^[0-9]{11}$|^[0-9]{14}$/),
      telefone1: z.string().nullable(),
      telefonewhatsapp1: z.string().nullable(),
      telefone2: z.string().nullable(),
      telefonewhatsapp2: z.string().nullable(),
      celularwhatsapp: z.string().nullable(),
      endereco: enderecoNullableSchema,
    })
    .strict(),
);

export const clienteUpdateSchema = z
  .object({
    razaoSocial: z.string().min(2).max(200).optional(),
    nomeFantasia: z.string().min(2).max(200).nullable().optional(),
    tipoPessoa: z
      .number()
      .int()
      .refine((value) => value === 0 || value === 1, {
        message: 'Tipo de pessoa inválido.',
      })
      .optional(),
    cpfCnpj: z.string().regex(/^[0-9]{11}$|^[0-9]{14}$/).optional(),
    email: z.string().email().max(255).nullable().optional(),
    telefone1: z.string().max(30).nullable().optional(),
    telefoneWhatsapp1: z.string().max(30).nullable().optional(),
    telefone2: z.string().max(30).nullable().optional(),
    telefoneWhatsapp2: z.string().max(30).nullable().optional(),
    celularWhatsapp: z.string().max(30).nullable().optional(),
    endereco: enderecoNullableSchema.optional(),
  })
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  });

export const clienteDeleteResponseSchema = z
  .object({
    message: z.string(),
    idCliente: z.number().int(),
    deletedAt: z.string().datetime().nullable().optional(),
  })
  .strict();
