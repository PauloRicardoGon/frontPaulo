import { z } from 'zod';

const imagemSchema = z
  .object({
    idImagem: z.number().int().optional().nullable(),
    titulo: z.string().max(100),
    descricao: z.string().max(255).nullable().optional(),
    url: z.string().url(),
    criadoEm: z.string().datetime().optional(),
  })
  .strict();

const imagemResponseSchema = imagemSchema.extend({
  idImagem: z.number().int(),
  criadoEm: z.string().datetime(),
}).strict();

export const equipamentoCreateSchema = z
  .object({
    idCliente: z.number().int(),
    nomeEquipamento: z.string().min(2).max(200),
    marca: z.string().min(1).max(100),
    modelo: z.string().min(1).max(100),
    numeroSerie: z.string().min(1).max(100),
    localInstalacao: z.string().max(200).nullable().optional(),
    fabricante: z.string().max(100).nullable().optional(),
    codigoInterno: z.string().max(50).nullable().optional(),
    numeroPatrimonio: z.string().max(50).nullable().optional(),
    descricao: z.string().max(1000).nullable().optional(),
    imagens: z.array(
      z
        .object({
          titulo: z.string().max(100),
          descricao: z.string().max(255).nullable().optional(),
          url: z.string(),
        })
        .strict(),
    )
      .nullable()
      .optional(),
  })
  .strict();

export const equipamentoResponseSchema = z
  .object({
    idEquipamento: z.number().int(),
    idCliente: z.number().int(),
    nomeEquipamento: z.string(),
    marca: z.string(),
    modelo: z.string(),
    numeroSerie: z.string(),
    localInstalacao: z.string().nullable(),
    fabricante: z.string().nullable(),
    codigoInterno: z.string().nullable(),
    numeroPatrimonio: z.string().nullable(),
    descricao: z.string().nullable(),
    imagens: z.array(imagemResponseSchema).nullable(),
    dataCadastro: z.string().datetime(),
    dataAtualizacao: z.string().datetime(),
  })
  .strict();

export const equipamentosListResponseSchema = z
  .object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    items: z
      .array(
        z
          .object({
            idEquipamento: z.number().int(),
            idCliente: z.number().int(),
            nomeEquipamento: z.string(),
            marca: z.string(),
            modelo: z.string(),
            numeroSerie: z.string(),
            localInstalacao: z.string().nullable(),
            fabricante: z.string().nullable(),
            codigoInterno: z.string().nullable(),
            numeroPatrimonio: z.string().nullable(),
            descricao: z.string().nullable(),
            imagens: z.array(imagemResponseSchema).nullable(),
            dataCadastro: z.string().datetime(),
            dataAtualizacao: z.string().datetime(),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

const historicoItemSchema = z
  .object({
    idOs: z.number().int(),
    status: z.enum([
      'aberta',
      'em_andamento',
      'aguardando_cliente',
      'finalizada',
      'cancelada',
    ]),
    resumo: z.string().nullable(),
    cliente: z
      .object({
        idCliente: z.number().int(),
        razaoSocial: z.string(),
        endereco: z
          .object({
            logradouro: z.string(),
            numero: z.string().nullable(),
            complemento: z.string().nullable(),
            bairro: z.string().nullable(),
            codigoCidade: z.number().int().nullable(),
            uf: z.string().min(2).max(2).nullable(),
            cep: z.string().nullable(),
          })
          .strict()
          .nullable(),
      })
      .strict(),
    dataAbertura: z.string().datetime().nullable(),
    dataAgendada: z.string().datetime().nullable(),
    dataConclusao: z.string().datetime().nullable(),
  })
  .strict();

export const equipamentoDetailsResponseSchema = equipamentoResponseSchema.extend({
  imagens: z.array(imagemResponseSchema).nullable().optional(),
  historicoOs: z
    .object({
      limit: z.number().int().min(0),
      offset: z.number().int().min(0),
      total: z.number().int().min(0),
      items: z.array(historicoItemSchema),
    })
    .strict()
    .nullable(),
});

export const equipamentoUpdateSchema = z
  .object({
    idCliente: z.number().int().optional(),
    nomeEquipamento: z.string().min(2).max(200).optional(),
    marca: z.string().min(1).max(100).optional(),
    modelo: z.string().min(1).max(100).optional(),
    numeroSerie: z.string().min(1).max(100).nullable().optional(),
    localInstalacao: z.string().max(200).nullable().optional(),
    fabricante: z.string().max(100).nullable().optional(),
    codigoInterno: z.string().max(50).nullable().optional(),
    numeroPatrimonio: z.string().max(50).nullable().optional(),
    descricao: z.string().max(1000).nullable().optional(),
    imagens: z
      .array(
        z
          .object({
            idImagem: z.number().int().nullable().optional(),
            titulo: z.string().max(100),
            descricao: z.string().max(255).nullable().optional(),
            url: z.string().url(),
          })
          .strict(),
      )
      .nullable()
      .optional(),
  })
  .refine((val) => Object.keys(val).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  });

export const equipamentoDeleteResponseSchema = z
  .object({
    message: z.string(),
    idEquipamento: z.number().int(),
    deletedAt: z.string().datetime().nullable().optional(),
  })
  .strict();
