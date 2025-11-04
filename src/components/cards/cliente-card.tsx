import Link from 'next/link';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClienteCardProps {
  idCliente: number;
  razaoSocial: string;
  cpfCnpj: string;
  telefone?: string | null;
  endereco?: string | null;
  className?: string;
}

export const ClienteCard = ({ idCliente, razaoSocial, cpfCnpj, telefone, endereco, className }: ClienteCardProps) => (
  <Link
    href={`/clientes/${idCliente}`}
    className={cn(
      'block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md',
      className,
    )}
  >
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Users className="h-5 w-5" />
      </span>
      <div>
        <h3 className="text-base font-semibold text-neutral-800">{razaoSocial}</h3>
        <p className="text-xs uppercase tracking-widest text-neutral-400">CPF/CNPJ: {cpfCnpj}</p>
      </div>
    </div>
    <div className="mt-3 space-y-1 text-sm text-neutral-600">
      {telefone ? <p>Telefone: {telefone}</p> : null}
      {endereco ? <p>Endereço: {endereco}</p> : null}
    </div>
  </Link>
);
