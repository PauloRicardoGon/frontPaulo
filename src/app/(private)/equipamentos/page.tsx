'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EquipamentoCard } from '@/components/cards/equipamento-card';
import { fetcher } from '@/lib/fetcher';
import { equipamentosListResponseSchema } from '@/lib/validators/equipamentos';
import { useEquipamentoFilters } from '@/stores/filters';

const EquipamentosPage = () => {
  const { data, error } = useSWR('/equipamentos', async (url) => {
    const response = await fetcher<unknown>(url);
    return equipamentosListResponseSchema.parse(response);
  });

  const { search, setSearch } = useEquipamentoFilters();

  const filtered = (data?.items ?? []).filter((item) => {
    const target = `${item.nomeEquipamento} ${item.marca} ${item.numeroSerie}`.toLowerCase();
    return target.includes(search.toLowerCase());
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-neutral-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar por nome ou número de série"
            className="border-none p-0 focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button asChild>
            <Link href="/equipamentos/novo">Novo Equipamento</Link>
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">Não foi possível carregar os equipamentos.</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((equipamento) => (
          <EquipamentoCard key={equipamento.idEquipamento} {...equipamento} />
        ))}
      </div>

      {!filtered.length && !error ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          Nenhum equipamento encontrado.
        </div>
      ) : null}
    </section>
  );
};

export default EquipamentosPage;
