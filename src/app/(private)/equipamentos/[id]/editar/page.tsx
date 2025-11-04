'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BarcodeInput } from '@/components/camera/barcode-input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form';
import { api } from '@/lib/api';
import {
  equipamentoDetailsResponseSchema,
  equipamentoUpdateSchema
} from '@/lib/validators/equipamentos';

const EquipamentoEditPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data } = useSWR(`/equipamentos/${params.id}`, async (url) => {
    const response = await api.get(url);
    return equipamentoDetailsResponseSchema.parse(response.data);
  });

  const form = useForm<z.infer<typeof equipamentoUpdateSchema>>({ resolver: zodResolver(equipamentoUpdateSchema) });
  const images = useFieldArray({ control: form.control, name: 'imagens' });

  useEffect(() => {
    form.register('numeroSerie');
  }, [form]);

  useEffect(() => {
    if (data) {
      form.reset({
        idCliente: data.idCliente,
        nomeEquipamento: data.nomeEquipamento,
        marca: data.marca,
        modelo: data.modelo,
        numeroSerie: data.numeroSerie ?? undefined,
        localInstalacao: data.localInstalacao ?? undefined,
        fabricante: data.fabricante ?? undefined,
        codigoInterno: data.codigoInterno ?? undefined,
        numeroPatrimonio: data.numeroPatrimonio ?? undefined,
        descricao: data.descricao ?? undefined,
        imagens: data.imagens?.map((imagem) => ({
          idImagem: imagem.idImagem,
          titulo: imagem.titulo,
          descricao: imagem.descricao ?? undefined,
          url: imagem.url,
        })),
      });
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof equipamentoUpdateSchema>) => {
    await api.put(`/equipamentos/${params.id}`, values);
    router.push(`/equipamentos/${params.id}`);
  };

  if (!data) {
    return <p className="text-sm text-neutral-500">Carregando...</p>;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800">Editar Equipamento</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          <FormItem>
            <FormLabel>ID Cliente</FormLabel>
            <FormControl>
              <Input type="number" {...form.register('idCliente', { valueAsNumber: true })} />
            </FormControl>
            <FormMessage name="idCliente" />
          </FormItem>

          <FormItem>
            <FormLabel>Nome do Equipamento</FormLabel>
            <FormControl>
              <Input {...form.register('nomeEquipamento')} />
            </FormControl>
            <FormMessage name="nomeEquipamento" />
          </FormItem>

          <FormItem>
            <FormLabel>Marca</FormLabel>
            <FormControl>
              <Input {...form.register('marca')} />
            </FormControl>
            <FormMessage name="marca" />
          </FormItem>

          <FormItem>
            <FormLabel>Modelo</FormLabel>
            <FormControl>
              <Input {...form.register('modelo')} />
            </FormControl>
            <FormMessage name="modelo" />
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Número de Série</FormLabel>
            <FormControl>
              <BarcodeInput
                value={form.watch('numeroSerie') ?? ''}
                onChange={(value) => form.setValue('numeroSerie', value, { shouldValidate: true })}
              />
            </FormControl>
            <FormMessage name="numeroSerie" />
          </FormItem>

          <FormItem>
            <FormLabel>Local de Instalação</FormLabel>
            <FormControl>
              <Input {...form.register('localInstalacao')} />
            </FormControl>
            <FormMessage name="localInstalacao" />
          </FormItem>

          <FormItem>
            <FormLabel>Fabricante</FormLabel>
            <FormControl>
              <Input {...form.register('fabricante')} />
            </FormControl>
            <FormMessage name="fabricante" />
          </FormItem>

          <FormItem>
            <FormLabel>Código Interno</FormLabel>
            <FormControl>
              <Input {...form.register('codigoInterno')} />
            </FormControl>
            <FormMessage name="codigoInterno" />
          </FormItem>

          <FormItem>
            <FormLabel>Nº Patrimônio</FormLabel>
            <FormControl>
              <Input {...form.register('numeroPatrimonio')} />
            </FormControl>
            <FormMessage name="numeroPatrimonio" />
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea {...form.register('descricao')} />
            </FormControl>
            <FormMessage name="descricao" />
          </FormItem>

          <div className="md:col-span-2 space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Imagens</h2>
              <Button type="button" variant="outline" onClick={() => images.append({ titulo: '', url: '', descricao: '' })}>
                Adicionar imagem
              </Button>
            </div>
            {images.fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 md:grid-cols-3">
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...form.register(`imagens.${index}.titulo` as const)} />
                  </FormControl>
                  <FormMessage name={`imagens.${index}.titulo`} />
                </FormItem>
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...form.register(`imagens.${index}.url` as const)} />
                  </FormControl>
                  <FormMessage name={`imagens.${index}.url`} />
                </FormItem>
                <div className="space-y-2">
                  <FormLabel>Descrição</FormLabel>
                  <Textarea {...form.register(`imagens.${index}.descricao` as const)} />
                  <Button type="button" variant="ghost" onClick={() => images.remove(index)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 flex justify-between">
            <Button type="button" variant="ghost" onClick={() => router.push(`/equipamentos/${params.id}`)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EquipamentoEditPage;
