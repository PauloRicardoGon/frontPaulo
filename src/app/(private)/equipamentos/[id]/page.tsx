'use client';

import useSWR from 'swr';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { equipamentoDetailsResponseSchema } from '@/lib/validators/equipamentos';
import dayjs from 'dayjs';

const EquipamentoDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data, error } = useSWR(`/equipamentos/${params.id}`, async (url) => {
    const response = await fetcher<unknown>(url);
    return equipamentoDetailsResponseSchema.parse(response);
  });

  if (error) {
    return <p className="text-sm text-red-600">Não foi possível carregar o equipamento.</p>;
  }

  if (!data) {
    return <p className="text-sm text-neutral-500">Carregando...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">{data.nomeEquipamento}</h1>
          <p className="text-sm text-neutral-500">
            {data.marca} • {data.modelo} — Nº de Série: {data.numeroSerie ?? 'Não informado'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push(`/equipamentos/${params.id}/editar`)}>
            Editar
          </Button>
          <Button variant="ghost" onClick={() => router.push('/equipamentos')}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-800">Dados Gerais</h2>
          <p className="text-sm text-neutral-600">Local: {data.localInstalacao ?? 'Não informado'}</p>
          <p className="text-sm text-neutral-600">Fabricante: {data.fabricante ?? 'Não informado'}</p>
          <p className="text-sm text-neutral-600">Código Interno: {data.codigoInterno ?? 'Não informado'}</p>
          <p className="text-sm text-neutral-600">Nº Patrimônio: {data.numeroPatrimonio ?? 'Não informado'}</p>
          <p className="text-sm text-neutral-600">Descrição: {data.descricao ?? 'Não informado'}</p>
          <p className="text-xs text-neutral-400">
            Atualizado em {dayjs(data.dataAtualizacao).format('DD/MM/YYYY HH:mm')}
          </p>
        </div>
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-800">Imagens</h2>
          {data.imagens && data.imagens.length > 0 ? (
            <ul className="space-y-2 text-sm text-neutral-600">
              {data.imagens.map((imagem) => (
                <li key={imagem.idImagem}>
                  <span className="font-semibold">{imagem.titulo}</span>
                  <p className="text-xs text-neutral-500">{imagem.descricao ?? 'Sem descrição'}</p>
                  <a href={imagem.url} className="text-sm text-primary underline" target="_blank" rel="noreferrer">
                    Abrir imagem
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">Nenhuma imagem disponível.</p>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-800">Histórico de OS</h2>
        {data.historicoOs && data.historicoOs.items.length > 0 ? (
          <ul className="space-y-3 text-sm text-neutral-600">
            {data.historicoOs.items.map((os) => (
              <li key={os.idOs} className="rounded-lg border border-neutral-200 p-3">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-800">OS #{os.idOs}</span>
                  <span className="text-xs uppercase tracking-wide text-neutral-400">Status: {os.status}</span>
                  <p className="text-sm text-neutral-600">{os.resumo ?? 'Sem resumo'}</p>
                  <p className="text-xs text-neutral-500">
                    Cliente: {os.cliente.razaoSocial} — Aberta em{' '}
                    {os.dataAbertura ? dayjs(os.dataAbertura).format('DD/MM/YYYY') : 'N/A'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">Nenhum histórico disponível.</p>
        )}
      </div>
    </section>
  );
};

export default EquipamentoDetailsPage;
