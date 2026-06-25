import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable, type Column } from './DataTable';

interface Row {
  id: string;
  name: string;
  price: number;
}

const columns: Column<Row>[] = [
  { key: 'name', header: 'Commodity' },
  { key: 'price', header: 'Price', align: 'right', render: (v) => Number(v).toFixed(2) },
];

describe('DataTable', () => {
  it('renders headers and rows', () => {
    const data: Row[] = [{ id: '1', name: 'Wheat', price: 534.25 }];
    render(<DataTable columns={columns} data={data} keyField="id" />);
    expect(screen.getByText('Commodity')).toBeInTheDocument();
    expect(screen.getByText('Wheat')).toBeInTheDocument();
    expect(screen.getByText('534.25')).toBeInTheDocument();
  });

  it('shows the empty message spanning all columns when there are no rows', () => {
    render(
      <DataTable columns={columns} data={[]} keyField="id" emptyMessage="No commodities." />,
    );
    const cell = screen.getByText('No commodities.');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveAttribute('colspan', String(columns.length));
  });
});
