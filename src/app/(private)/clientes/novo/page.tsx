'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form';
import { api } from '@/lib/api';
import { clienteCreateSchema, type ClienteCreateInput } from '@/lib/validators/clientes';
import { useState } from 'react';

const ClienteCreatePage = () => {
  const router = useRouter();
  const form = useForm<ClienteCreateInput>({
    resolver: zodResolver(clienteCreateSchema),
    defaultValues: {
      tipoPessoa: 0,
      endereco: {
        logradouro: '',
        numero: null,
        complemento: null,
        bairro: null,
        codigoCidade: null,
        uf: null,
        cep: null,
      },
    },
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (values: ClienteCreateInput) => {
    try {
      const { data } = await api.post('/clientes', values);
      setSuccessMessage('Cliente salvo com sucesso.');
      if (data?.idCliente) {
        router.push(`/clientes/${data.idCliente}`);
      }
    } catch (error) {
      setSuccessMessage('Não foi possível salvar o cliente agora. Ele será enviado quando houver conexão.');
      router.push('/clientes');
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800">Cadastrar Cliente</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          <FormItem className="md:col-span-2">
            <FormLabel>Razão Social *</FormLabel>
            <FormControl>
              <Input {...form.register('razaoSocial')} placeholder="Nome/Razão Social" />
            </FormControl>
            <FormMessage name="razaoSocial" />
          </FormItem>

          <FormItem className="md:col-span-2">
            <FormLabel>Nome Fantasia</FormLabel>
            <FormControl>
              <Input {...form.register('nomeFantasia')} placeholder="Nome Fantasia" />
            </FormControl>
            <FormMessage name="nomeFantasia" />
          </FormItem>

          <FormItem>
            <FormLabel>CPF/CNPJ *</FormLabel>
            <FormControl>
              <Input {...form.register('cpfCnpj')} placeholder="Somente números" />
            </FormControl>
            <FormMessage name="cpfCnpj" />
          </FormItem>

          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input type="email" {...form.register('email')} placeholder="email@cliente.com" />
            </FormControl>
            <FormMessage name="email" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input {...form.register('telefone1')} placeholder="Telefone" />
            </FormControl>
            <FormMessage name="telefone1" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone WhatsApp</FormLabel>
            <FormControl>
              <Input {...form.register('telefoneWhatsapp1')} placeholder="WhatsApp" />
            </FormControl>
            <FormMessage name="telefoneWhatsapp1" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone 2</FormLabel>
            <FormControl>
              <Input {...form.register('telefone2')} placeholder="Telefone 2" />
            </FormControl>
            <FormMessage name="telefone2" />
          </FormItem>

          <FormItem>
            <FormLabel>Telefone WhatsApp 2</FormLabel>
            <FormControl>
              <Input {...form.register('telefoneWhatsapp2')} placeholder="WhatsApp 2" />
            </FormControl>
            <FormMessage name="telefoneWhatsapp2" />
          </FormItem>

          <FormItem>
            <FormLabel>Celular WhatsApp</FormLabel>
            <FormControl>
              <Input {...form.register('celularWhatsapp')} placeholder="Celular WhatsApp" />
            </FormControl>
            <FormMessage name="celularWhatsapp" />
          </FormItem>

          <div className="md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700">Tipo de Pessoa *</span>
            <div className="mt-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  value={0}
                  checked={form.watch('tipoPessoa') === 0}
                  onChange={() => form.setValue('tipoPessoa', 0)}
                />
                Pessoa Física
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  value={1}
                  checked={form.watch('tipoPessoa') === 1}
                  onChange={() => form.setValue('tipoPessoa', 1)}
                />
                Pessoa Jurídica
              </label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-neutral-800">Endereço</h2>
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input {...form.register('endereco.logradouro')} placeholder="Logradouro" />
              </FormControl>
              <FormMessage name="endereco.logradouro" />
            </FormItem>
            <div className="grid gap-4 md:grid-cols-2">
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.numero')} placeholder="Número" />
                </FormControl>
                <FormMessage name="endereco.numero" />
              </FormItem>
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.complemento')} placeholder="Complemento" />
                </FormControl>
                <FormMessage name="endereco.complemento" />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...form.register('endereco.bairro')} placeholder="Bairro" />
              </FormControl>
              <FormMessage name="endereco.bairro" />
            </FormItem>
            <div className="grid gap-4 md:grid-cols-3">
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.cep')} placeholder="CEP" />
                </FormControl>
                <FormMessage name="endereco.cep" />
              </FormItem>
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input {...form.register('endereco.uf')} placeholder="UF" />
                </FormControl>
                <FormMessage name="endereco.uf" />
              </FormItem>
              <FormItem>
                <FormLabel>Código Cidade</FormLabel>
                <FormControl>
                  <Input type="number" {...form.register('endereco.codigoCidade', { valueAsNumber: true })} placeholder="Código" />
                </FormControl>
                <FormMessage name="endereco.codigoCidade" />
              </FormItem>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar' }
            </Button>
          </div>
          {successMessage ? (
            <p className="md:col-span-2 text-sm font-medium text-emerald-600">{successMessage}</p>
          ) : null}
        </form>
      </Form>
    </section>
  );
};

export default ClienteCreatePage;
