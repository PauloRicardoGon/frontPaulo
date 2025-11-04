import Link from 'next/link';
import { Package, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipamentoCardProps {
  idEquipamento: number;
  nomeEquipamento: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  localInstalacao?: string | null;
  className?: string;
}

export const EquipamentoCard = ({
  idEquipamento,
  nomeEquipamento,
  marca,
  modelo,
  numeroSerie,
  localInstalacao,
  className,
}: EquipamentoCardProps) => (
  <Link
    href={`/equipamentos/${idEquipamento}`}
    className={cn(
      'block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md',
      className,
    )}
  >
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Package className="h-5 w-5" />
      </span>
      <div>
        <h3 className="text-base font-semibold text-neutral-800">{nomeEquipamento}</h3>
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          {marca} • {modelo}
        </p>
      </div>
    </div>
    <div className="mt-3 space-y-1 text-sm text-neutral-600">
      <p className="flex items-center gap-2">
        <Scan className="h-4 w-4 text-primary" /> Nº de Série: {numeroSerie}
      </p>
      {localInstalacao ? <p>Local de instalação: {localInstalacao}</p> : null}
    </div>
  </Link>
);
