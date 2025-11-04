'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form';
import { api } from '@/lib/api';
import { clienteResponseSchema, clienteUpdateSchema } from '@/lib/validators/clientes';

const ClienteEditPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data } = useSWR(`/clientes/${params.id}`, async (url) => {
    const response = await api.get(url);
    return clienteResponseSchema.parse(response.data);
  });

  const form = useForm({ resolver: zodResolver(clienteUpdateSchema) });

  useEffect(() => {
    if (data) {
      form.reset({
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        tipoPessoa: data.tipoPessoa ?? undefined,
        cpfCnpj: data.cpfCnpj,
        email: data.email,
        telefone1: data.telefone1,
        telefoneWhatsapp1: data.telefoneWhatsapp1,
        telefone2: data.telefone2,
        telefoneWhatsapp2: data.telefoneWhatsapp2,
        celularWhatsapp: data.celularWhatsapp,
        endereco: data.endereco ?? undefined,
      });
    }
  }, [data, form]);

  const onSubmit = async (values: unknown) => {
    await api.put(`/clientes/${params.id}`, values);
    router.push(`/clientes/${params.id}`);
  };

  if (!data) {
    return <p className="text-sm text-neutral-500">Carregando...</p>;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800">Editar Cliente</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          <FormItem className="md:col-span-2">
            <FormLabel>Razão Social</FormLabel>
            <FormControl>
              <Input {...form.register('razaoSocial')} />
            </FormControl>
            <FormMessage name="razaoSocial" />
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Nome Fantasia</FormLabel>
            <FormControl>
              <Input {...form.register('nomeFantasia')} />
            </FormControl>
            <FormMessage name="nomeFantasia" />
          </FormItem>

          <FormItem>
            <FormLabel>CPF/CNPJ</FormLabel>
            <FormControl>
              <Input {...form.register('cpfCnpj')} />
            </FormControl>
            <FormMessage name="cpfCnpj" />
          </FormItem>

          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input type="email" {...form.register('email')} />
            </FormControl>
            <FormMessage name="email" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input {...form.register('telefone1')} />
            </FormControl>
            <FormMessage name="telefone1" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone WhatsApp</FormLabel>
            <FormControl>
              <Input {...form.register('telefoneWhatsapp1')} />
            </FormControl>
            <FormMessage name="telefoneWhatsapp1" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone 2</FormLabel>
            <FormControl>
              <Input {...form.register('telefone2')} />
            </FormControl>
            <FormMessage name="telefone2" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone WhatsApp 2</FormLabel>
            <FormControl>
              <Input {...form.register('telefoneWhatsapp2')} />
            </FormControl>
            <FormMessage name="telefoneWhatsapp2" />
          </FormItem>

          <FormItem>
            <FormLabel>Celular WhatsApp</FormLabel>
            <FormControl>
              <Input {...form.register('celularWhatsapp')} />
            </FormControl>
            <FormMessage name="celularWhatsapp" />
          </FormItem>

          <div className="md:col-span-2 space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-neutral-800">Endereço</h2>
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input {...form.register('endereco.logradouro')} />
              </FormControl>
              <FormMessage name="endereco.logradouro" />
            </FormItem>
            <div className="grid gap-4 md:grid-cols-2">
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.numero')} />
                </FormControl>
                <FormMessage name="endereco.numero" />
              </FormItem>
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.complemento')} />
                </FormControl>
                <FormMessage name="endereco.complemento" />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...form.register('endereco.bairro')} />
              </FormControl>
              <FormMessage name="endereco.bairro" />
            </FormItem>
            <div className="grid gap-4 md:grid-cols-3">
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.cep')} />
                </FormControl>
                <FormMessage name="endereco.cep" />
              </FormItem>
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.uf')} />
                </FormControl>
                <FormMessage name="endereco.uf" />
              </FormItem>
              <FormItem>
                <FormLabel>Código Cidade</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.codigoCidade')} />
                </FormControl>
                <FormMessage name="endereco.codigoCidade" />
              </FormItem>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-between">
            <Button type="button" variant="ghost" onClick={() => router.push(`/clientes/${params.id}`)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ClienteEditPage;
