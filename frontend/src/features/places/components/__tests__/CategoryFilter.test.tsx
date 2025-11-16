import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CategoryFilter } from '../CategoryFilter';

describe('CategoryFilter', () => {
  it('renders all category options', () => {
    const mockOnChange = vi.fn();
    render(<CategoryFilter value={undefined} onChange={mockOnChange} />);

    expect(screen.getByText(/all categories/i)).toBeInTheDocument();
    expect(screen.getByText(/restaurant/i)).toBeInTheDocument();
    expect(screen.getByText(/cafe/i)).toBeInTheDocument();
    expect(screen.getByText(/bar/i)).toBeInTheDocument();
    expect(screen.getByText(/tourist/i)).toBeInTheDocument();
  });

  it('displays selected category', () => {
    const mockOnChange = vi.fn();
    render(<CategoryFilter value="restaurant" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('restaurant');
  });

  it('calls onChange when category selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<CategoryFilter value={undefined} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'cafe');

    expect(mockOnChange).toHaveBeenCalledWith('cafe');
  });

  it('calls onChange with undefined when "All" selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<CategoryFilter value="restaurant" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '');

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });
});
