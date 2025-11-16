import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RegionFilter } from '../RegionFilter';

describe('RegionFilter', () => {
  it('renders all region options', () => {
    const mockOnChange = vi.fn();
    render(<RegionFilter value={undefined} onChange={mockOnChange} />);

    expect(screen.getByText(/all regions/i)).toBeInTheDocument();
    expect(screen.getByText(/seoul/i)).toBeInTheDocument();
    expect(screen.getByText(/busan/i)).toBeInTheDocument();
    expect(screen.getByText(/jeju/i)).toBeInTheDocument();
  });

  it('displays selected region', () => {
    const mockOnChange = vi.fn();
    render(<RegionFilter value="seoul" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('seoul');
  });

  it('calls onChange when region selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<RegionFilter value={undefined} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'busan');

    expect(mockOnChange).toHaveBeenCalledWith('busan');
  });

  it('calls onChange with undefined when "All" selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<RegionFilter value="seoul" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '');

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });
});
