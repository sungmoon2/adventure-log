import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput placeholder="Search adventures" />);
    expect(screen.getByPlaceholderText('Search adventures')).toBeInTheDocument();
  });

  it('displays search icon', () => {
    const { container } = render(<SearchInput />);
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('shows clear button when has value', () => {
    render(<SearchInput value="test query" onChange={() => {}} />);
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('hides clear button when empty', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onClear when clear button clicked', async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(<SearchInput value="test" onChange={() => {}} onClear={onClear} />);

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows pulsing animation when searching', () => {
    const { container } = render(<SearchInput isSearching={true} />);
    const searchIcon = container.querySelector('.animate-pulse');
    expect(searchIcon).toBeInTheDocument();
  });
});
