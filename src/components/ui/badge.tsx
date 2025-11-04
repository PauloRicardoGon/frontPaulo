import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};
