'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClienteCard } from '@/components/cards/cliente-card';
import { fetcher } from '@/lib/fetcher';
import { clientesListResponseSchema } from '@/lib/validators/clientes';
import { useClienteFilters } from '@/stores/filters';

const ClientesPage = () => {
  const { data, error } = useSWR('/clientes', async (url) => {
    const response = await fetcher<unknown>(url);
    return clientesListResponseSchema.parse(response);
  });

  const { search, setSearch } = useClienteFilters();

  const filtered = (data ?? []).filter((cliente) =>
    cliente.razaoSocial.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-neutral-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar por Nome/Razão Social"
            className="border-none p-0 focus-visible:ring-0"
          />
        </div>
        <Button asChild>
          <Link href="/clientes/novo">Novo Cliente</Link>
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">Não foi possível carregar os clientes.</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((cliente) => (
          <ClienteCard
            key={cliente.idCliente}
            idCliente={cliente.idCliente}
            razaoSocial={cliente.razaoSocial}
            cpfCnpj={cliente.cpfCnpj}
            telefone={cliente.telefone1 ?? cliente.telefonewhatsapp1 ?? cliente.celularwhatsapp}
            endereco={cliente.endereco?.logradouro ?? null}
          />
        ))}
        {!filtered.length && !error ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
            Nenhum cliente encontrado.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ClientesPage;
