'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BarcodeInput } from '@/components/camera/barcode-input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form';
import { api } from '@/lib/api';
import { equipamentoCreateSchema } from '@/lib/validators/equipamentos';
import { z } from 'zod';

const EquipamentoCreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof equipamentoCreateSchema>>({
    resolver: zodResolver(equipamentoCreateSchema),
    defaultValues: {
      numeroSerie: '',
      imagens: [],
    },
  });

  useEffect(() => {
    form.register('numeroSerie');
  }, [form]);

  const images = useFieldArray({ control: form.control, name: 'imagens' });

  const onSubmit = async (values: z.infer<typeof equipamentoCreateSchema>) => {
    const { data } = await api.post('/equipamentos', values);
    router.push(`/equipamentos/${data.idEquipamento ?? ''}`);
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800">Cadastrar Equipamento</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          <FormItem>
            <FormLabel>ID Cliente *</FormLabel>
            <FormControl>
              <Input type="number" {...form.register('idCliente', { valueAsNumber: true })} placeholder="ID do cliente" />
            </FormControl>
            <FormMessage name="idCliente" />
          </FormItem>

          <FormItem>
            <FormLabel>Nome do Equipamento *</FormLabel>
            <FormControl>
              <Input {...form.register('nomeEquipamento')} placeholder="Equipamento" />
            </FormControl>
            <FormMessage name="nomeEquipamento" />
          </FormItem>

          <FormItem>
            <FormLabel>Marca *</FormLabel>
            <FormControl>
              <Input {...form.register('marca')} placeholder="Marca" />
            </FormControl>
            <FormMessage name="marca" />
          </FormItem>

          <FormItem>
            <FormLabel>Modelo *</FormLabel>
            <FormControl>
              <Input {...form.register('modelo')} placeholder="Modelo" />
            </FormControl>
            <FormMessage name="modelo" />
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Número de Série *
            </FormLabel>
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
              <Input {...form.register('localInstalacao')} placeholder="Local de instalação" />
            </FormControl>
            <FormMessage name="localInstalacao" />
          </FormItem>

          <FormItem>
            <FormLabel>Fabricante</FormLabel>
            <FormControl>
              <Input {...form.register('fabricante')} placeholder="Fabricante" />
            </FormControl>
            <FormMessage name="fabricante" />
          </FormItem>

          <FormItem>
            <FormLabel>Código Interno</FormLabel>
            <FormControl>
              <Input {...form.register('codigoInterno')} placeholder="Código interno" />
            </FormControl>
            <FormMessage name="codigoInterno" />
          </FormItem>

          <FormItem>
            <FormLabel>Nº Patrimônio</FormLabel>
            <FormControl>
              <Input {...form.register('numeroPatrimonio')} placeholder="Número de patrimônio" />
            </FormControl>
            <FormMessage name="numeroPatrimonio" />
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea {...form.register('descricao')} placeholder="Descrição do equipamento" />
            </FormControl>
            <FormMessage name="descricao" />
          </FormItem>

          <div className="md:col-span-2 space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Imagens</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => images.append({ titulo: '', url: '', descricao: '' })}
              >
                Adicionar imagem
              </Button>
            </div>
            {images.fields.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhuma imagem anexada.</p>
            ) : null}
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
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EquipamentoCreatePage;
