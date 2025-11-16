import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QuickSaveModal } from '../QuickSaveModal';

describe('QuickSaveModal', () => {
  it('renders modal when open', () => {
    const mockOnClose = vi.fn();
    render(<QuickSaveModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText(/quick save/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
  });

  it('validates URL format', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<QuickSaveModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/enter url/i);
    await user.type(input, 'invalid-url');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/invalid url/i)).toBeInTheDocument();
  });

  it('extracts metadata from valid URL', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <QuickSaveModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    const input = screen.getByPlaceholderText(/enter url/i);
    await user.type(input, 'https://example.com/place');

    await waitFor(() => {
      expect(screen.getByText(/extracting/i)).toBeInTheDocument();
    });
  });

  it('saves draft with URL only on metadata failure', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <QuickSaveModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    const input = screen.getByPlaceholderText(/enter url/i);
    await user.type(input, 'https://example.com/place');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://example.com/place',
          status: 'draft',
        })
      );
    });
  });
});
