import { type CSSProperties, useEffect, useRef, useState } from 'react';

export type JobStage =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'timeout';

export interface AsyncJobCardProps {
  jobId: string;
  title: string;
  submittedAt: string;
  status: JobStage;
  microcopy?: Partial<Record<JobStage, string>>;
  artifactHref?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

const DEFAULT_MICROCOPY: Record<JobStage, string> = {
  pending:
    'Queued. Waiting for the forecast engine to pick it up…',
  running:
    'Model training in progress. This usually takes 1–3 minutes.',
  completed: 'Forecast ready. Click below to view the result.',
  failed:
    'The forecast generation failed. You can retry below.',
  canceled: 'Job canceled.',
  timeout:
    'The forecast did not settle in time. Retrying is safe.',
};

const STAGE_ORDER: JobStage[] = ['pending', 'running', 'completed'];

export function AsyncJobCard(props: AsyncJobCardProps) {
  const microcopy = { ...DEFAULT_MICROCOPY, ...props.microcopy };
  const isTerminal =
    props.status !== 'pending' && props.status !== 'running';
  const elapsed = useElapsed(props.submittedAt, isTerminal);

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy={!isTerminal}
      data-testid="async-job-card"
      style={cardStyle}
    >
      <header style={headerStyle}>
        <span
          style={badgeStyle(props.status)}
          data-testid="async-job-card-status"
        >
          {props.status.toUpperCase()}
        </span>
        <time
          style={elapsedStyle}
          aria-label={`Elapsed ${elapsed}`}
          dateTime={props.submittedAt}
        >
          {elapsed}
        </time>
      </header>

      <h3 style={titleStyle}>{props.title}</h3>
      <p style={subtitleStyle}>
        Job&nbsp;<code>{props.jobId.slice(0, 8)}…</code>
      </p>

      <ol role="list" style={stageRowStyle}>
        {STAGE_ORDER.map((s) => {
          const active = s === currentStage(props.status);
          const done =
            STAGE_ORDER.indexOf(s) <
            STAGE_ORDER.indexOf(currentStage(props.status));
          return (
            <li
              key={s}
              role="listitem"
              aria-current={active ? 'step' : undefined}
              style={dotStyle(active, done)}
              aria-hidden="true"
            />
          );
        })}
      </ol>

      <p style={microcopyStyle}>{microcopy[props.status]}</p>

      <div style={actionsStyle}>
        {props.status === 'completed' && props.artifactHref && (
          <a
            href={props.artifactHref}
            style={buttonStyle('primary')}
            data-testid="async-job-card-view"
          >
            View result
          </a>
        )}
        {(props.status === 'failed' ||
          props.status === 'timeout') &&
          props.onRetry && (
            <button
              type="button"
              onClick={props.onRetry}
              style={buttonStyle('outline')}
              data-testid="async-job-card-retry"
            >
              Retry
            </button>
          )}
        {(props.status === 'pending' ||
          props.status === 'running') &&
          props.onCancel && (
            <button
              type="button"
              onClick={props.onCancel}
              style={buttonStyle('ghost')}
              data-testid="async-job-card-cancel"
            >
              Cancel
            </button>
          )}
      </div>
    </section>
  );
}

function currentStage(s: JobStage): JobStage {
  if (s === 'pending' || s === 'running') return s;
  return 'completed';
}

function badgeTone(s: JobStage): 'success' | 'danger' | 'info' {
  if (s === 'completed') return 'success';
  if (s === 'failed' || s === 'timeout' || s === 'canceled')
    return 'danger';
  return 'info';
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border, #e4e4e7)',
  borderRadius: 12,
  padding: 16,
  background: 'var(--color-card, #fff)',
  color: 'var(--color-card-foreground, #111)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  // No maxWidth: the card fills its column like every other uilib surface
  // (Card, Alert, tables). A fixed cap here made job cards visibly narrower
  // than sibling Card/Alert widgets stacked in the same PageContentSection,
  // which reads as "misaligned" even though each element is individually fine.
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

function badgeStyle(s: JobStage): CSSProperties {
  const tone = badgeTone(s);
  const bg =
    tone === 'success'
      ? 'rgba(34,197,94,0.12)'
      : tone === 'danger'
        ? 'rgba(239,68,68,0.12)'
        : 'rgba(59,130,246,0.12)';
  const fg =
    tone === 'success'
      ? 'rgb(21,128,61)'
      : tone === 'danger'
        ? 'rgb(185,28,28)'
        : 'rgb(29,78,216)';
  return {
    background: bg,
    color: fg,
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.4,
  };
}

const elapsedStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--color-muted-foreground, #6b7280)',
  fontFamily: 'var(--font-mono, monospace)',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: 'var(--color-muted-foreground, #6b7280)',
};

const stageRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

function dotStyle(active: boolean, done: boolean): CSSProperties {
  return {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: done
      ? 'rgb(34,197,94)'
      : active
        ? 'rgb(59,130,246)'
        : 'var(--color-muted, #d4d4d8)',
    boxShadow: active
      ? '0 0 0 3px rgba(59,130,246,0.18)'
      : undefined,
  };
}

const microcopyStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.4,
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
};

function buttonStyle(
  variant: 'primary' | 'outline' | 'ghost',
): CSSProperties {
  const base: CSSProperties = {
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid transparent',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  };
  if (variant === 'primary')
    return {
      ...base,
      background: 'var(--color-primary, #2563eb)',
      color: 'var(--color-primary-foreground, #fff)',
    };
  if (variant === 'outline')
    return {
      ...base,
      background: 'transparent',
      color: 'var(--color-foreground, #111)',
      borderColor: 'var(--color-border, #e4e4e7)',
    };
  return {
    ...base,
    background: 'transparent',
    color: 'var(--color-muted-foreground, #6b7280)',
  };
}

function useElapsed(submittedAt: string, frozen: boolean): string {
  const startedRef = useRef(new Date(submittedAt).getTime());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (frozen) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [frozen]);
  const seconds = Math.max(
    0,
    Math.floor((now - startedRef.current) / 1000),
  );
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
