import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * URL-synced state hook (P-03 in docs/frontend-interaction-patterns.md).
 *
 * Treats the URL search params as the source of truth for filter / sort /
 * pagination state. Empty values and values equal to the defaults are
 * stripped from the URL so users land on `?status=completed` rather than
 * `?zone=&status=completed&page=1`.
 *
 * Usage:
 *   const [{ zone, status, page }, setUrl] = useUrlState({
 *     zone: '', status: '', page: '1',
 *   });
 *   setUrl({ zone: 'Lisboa', page: '1' });  // partial updates
 *
 * Updates use `history.replaceState` so the back button steps through
 * meaningful navigation events, not every keystroke. Debounce text inputs
 * upstream (300 ms is the industry-standard).
 */
export function useUrlState<T extends Record<string, string>>(
  defaults: T,
): readonly [T, (next: Partial<T>) => void] {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    const merged: Record<string, string> = { ...defaults };
    params.forEach((value, key) => {
      merged[key] = value;
    });
    return merged as T;
  }, [params, defaults]);

  const setState = useCallback(
    (next: Partial<T>) => {
      const merged = new URLSearchParams(params);
      for (const [key, value] of Object.entries(next)) {
        const stringValue =
          value == null ? '' : String(value);
        if (stringValue === '' || stringValue === defaults[key]) {
          merged.delete(key);
        } else {
          merged.set(key, stringValue);
        }
      }
      setParams(merged, { replace: true });
    },
    [params, setParams, defaults],
  );

  return [state, setState] as const;
}
