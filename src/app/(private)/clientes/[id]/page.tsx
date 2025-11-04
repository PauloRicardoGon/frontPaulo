'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { clienteResponseSchema } from '@/lib/validators/clientes';

const ClienteDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<'dados' | 'equipamentos' | 'consertos'>('dados');

  const { data, error } = useSWR(`/clientes/${params.id}`, async (url) => {
    const response = await fetcher<unknown>(url);
    return clienteResponseSchema.parse(response);
  });

  if (error) {
    return <p className="text-sm text-red-600">Não foi possível carregar o cliente.</p>;
  }

  if (!data) {
    return <p className="text-sm text-neutral-500">Carregando...</p>;
  }

  const endereco = data.endereco
    ? [
        data.endereco.logradouro,
        data.endereco.numero,
        data.endereco.bairro,
        data.endereco.uf,
        data.endereco.cep,
      ]
        .filter(Boolean)
        .join(', ')
    : 'Endereço não informado';

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">{data.razaoSocial}</h1>
          <p className="text-sm text-neutral-500">CPF/CNPJ: {data.cpfCnpj}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push(`/clientes/${data.idCliente}/editar`)}>
            Editar
          </Button>
          <Button variant="ghost" onClick={() => router.push('/clientes')}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        {(
          [
            { id: 'dados', label: 'Dados' },
            { id: 'equipamentos', label: 'Equipamentos' },
            { id: 'consertos', label: 'Consertos' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === item.id ? 'bg-primary text-white' : 'bg-white text-neutral-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'dados' ? (
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6">
          <div>
            <span className="text-xs font-semibold uppercase text-neutral-400">E-mail</span>
            <p className="text-sm text-neutral-700">{data.email ?? 'Não informado'}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-neutral-400">Telefone</span>
            <p className="text-sm text-neutral-700">{data.telefone1 ?? data.telefoneWhatsapp1 ?? 'Não informado'}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-neutral-400">Endereço</span>
            <p className="text-sm text-neutral-700">{endereco}</p>
          </div>
        </div>
      ) : null}

      {tab === 'equipamentos' ? (
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 text-neutral-600">
          <p>Integração com a listagem de equipamentos será exibida aqui.</p>
        </div>
      ) : null}

      {tab === 'consertos' ? (
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 text-neutral-600">
          <p>Histórico de consertos disponível em breve.</p>
        </div>
      ) : null}
    </section>
  );
};

export default ClienteDetailsPage;
