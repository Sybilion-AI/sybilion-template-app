import { Chip, type ChipProps } from '@sybilion/uilib';

export type StatusTone = 'active' | 'pending' | 'error' | 'info' | 'neutral';

const toneMap: Record<StatusTone, { label: string; variant: ChipProps['variant'] }> = {
  active: { label: 'Active', variant: 'positive' },
  pending: { label: 'Pending', variant: 'yellow' },
  error: { label: 'Error', variant: 'negative' },
  info: { label: 'Info', variant: 'filled' },
  neutral: { label: 'Neutral', variant: 'line' },
};

export interface StatusBadgeProps {
  status: StatusTone;
  label?: string;
  className?: string;
}

/** Semantic status pill on the uilib Chip palette. Pass `label` to override the default per-tone text. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { label: defaultLabel, variant } = toneMap[status];
  return (
    <Chip variant={variant} squared className={className}>
      {label ?? defaultLabel}
    </Chip>
  );
}
