import { Badge, type BadgeProps } from '@sybilion/uilib';

export type StatusTone = 'active' | 'pending' | 'error' | 'info' | 'neutral';

const toneMap: Record<StatusTone, { label: string; variant: BadgeProps['variant'] }> = {
  active: { label: 'Active', variant: 'green' },
  pending: { label: 'Pending', variant: 'yellow' },
  error: { label: 'Error', variant: 'red' },
  info: { label: 'Info', variant: 'default' },
  neutral: { label: 'Neutral', variant: 'outline' },
};

export interface StatusBadgeProps {
  status: StatusTone;
  label?: string;
  className?: string;
}

/** Semantic status pill on the uilib Badge palette. Pass `label` to override the default per-tone text. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { label: defaultLabel, variant } = toneMap[status];
  return (
    <Badge variant={variant} className={className}>
      {label ?? defaultLabel}
    </Badge>
  );
}
