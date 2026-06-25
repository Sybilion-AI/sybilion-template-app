import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { useUrlState } from './useUrlState';

function HookProbe({
  defaults,
  onReady,
}: {
  defaults: Record<string, string>;
  onReady: (
    state: Record<string, string>,
    setState: (next: Record<string, string>) => void,
  ) => void;
}) {
  const [state, setState] = useUrlState(defaults);
  const location = useLocation();
  onReady(state, (next) => setState(next as never));
  return <span data-testid="search">{location.search}</span>;
}

function renderHook(
  defaults: Record<string, string>,
  initialUrl = '/',
) {
  let api: {
    state: Record<string, string>;
    setState: (next: Record<string, string>) => void;
  } = {
    state: { ...defaults },
    setState: () => {},
  };
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Routes>
        <Route
          path="/"
          element={
            <HookProbe
              defaults={defaults}
              onReady={(state, setState) => {
                api = { state, setState };
              }}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
  return {
    get state() {
      return api.state;
    },
    setState: (next: Record<string, string>) => api.setState(next),
  };
}

describe('useUrlState', () => {
  it('seeds the state from URL search params', () => {
    const probe = renderHook(
      { zone: '', status: '', page: '1' },
      '/?zone=Lisboa&status=completed',
    );
    expect(probe.state).toEqual({
      zone: 'Lisboa',
      status: 'completed',
      page: '1',
    });
  });

  it('falls back to defaults when keys are absent', () => {
    const probe = renderHook({ zone: '', status: '', page: '1' });
    expect(probe.state).toEqual({
      zone: '',
      status: '',
      page: '1',
    });
  });

  it('writes non-default values to the URL', () => {
    const probe = renderHook({ zone: '', status: '', page: '1' });
    act(() => probe.setState({ zone: 'Lisboa', page: '2' }));
    expect(screen.getByTestId('search').textContent).toBe(
      '?zone=Lisboa&page=2',
    );
  });

  it('strips a key from the URL when set back to its default', () => {
    const probe = renderHook(
      { zone: '', status: '', page: '1' },
      '/?zone=Lisboa&status=completed',
    );
    act(() => probe.setState({ zone: '' }));
    expect(screen.getByTestId('search').textContent).toBe(
      '?status=completed',
    );
  });

  it('strips a page=1 key (default) when paginating back to the first page', () => {
    const probe = renderHook(
      { zone: '', status: '', page: '1' },
      '/?page=3',
    );
    act(() => probe.setState({ page: '1' }));
    expect(screen.getByTestId('search').textContent).toBe('');
  });
});
