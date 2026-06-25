import { type CSSProperties, type ReactNode } from 'react';

export interface EmptyStateCta {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface EmptyStateProps {
  what: string;
  why?: ReactNode;
  cta?: EmptyStateCta;
  icon?: ReactNode;
  /** Reduces padding and minHeight for secondary/auxiliary sections (e.g. history panels). */
  compact?: boolean;
}

export function EmptyState(props: EmptyStateProps) {
  const style = props.compact
    ? { ...containerStyle, minHeight: 0, padding: '12px 16px' }
    : containerStyle;
  return (
    <section
      role="region"
      aria-label="Empty state"
      data-testid="empty-state"
      style={style}
    >
      {props.icon && (
        <div aria-hidden="true" style={iconStyle}>
          {props.icon}
        </div>
      )}
      <h3 style={whatStyle}>{props.what}</h3>
      {props.why && <p style={whyStyle}>{props.why}</p>}
      {props.cta && <EmptyStateButton {...props.cta} />}
    </section>
  );
}

function EmptyStateButton(cta: EmptyStateCta) {
  if (cta.href) {
    return (
      <a
        href={cta.href}
        style={ctaStyle}
        data-testid="empty-state-cta"
      >
        {cta.label}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={cta.onClick}
      style={ctaStyle}
      data-testid="empty-state-cta"
    >
      {cta.label}
    </button>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '48px 24px',
  minHeight: 240,
  gap: 8,
};

const iconStyle: CSSProperties = {
  marginBottom: 8,
  color: 'var(--color-muted-foreground, #6b7280)',
};

const whatStyle: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
};

const whyStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'var(--color-muted-foreground, #6b7280)',
  maxWidth: 480,
  lineHeight: 1.4,
};

const ctaStyle: CSSProperties = {
  marginTop: 12,
  padding: '8px 16px',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  border: '1px solid transparent',
  background: 'var(--color-primary, #2563eb)',
  color: 'var(--color-primary-foreground, #fff)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
};
