import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ImageUploader } from '../ImageUploader';

describe('ImageUploader', () => {
  it('renders upload zone', () => {
    const mockOnUpload = vi.fn();
    render(<ImageUploader onUpload={mockOnUpload} />);

    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
  });

  it('accepts drag and drop', async () => {
    const mockOnUpload = vi.fn();
    render(<ImageUploader onUpload={mockOnUpload} />);

    const dropzone = screen.getByText(/drag.*drop/i).parentElement!;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate drag over
    const dragEvent = new Event('dragover', { bubbles: true });
    dropzone.dispatchEvent(dragEvent);

    expect(dropzone.className).toContain('border-blue-500');
  });

  it('validates file type', async () => {
    const user = userEvent.setup();
    const mockOnUpload = vi.fn();
    render(<ImageUploader onUpload={mockOnUpload} maxFiles={5} />);

    const input = screen.getByLabelText(/choose files/i) as HTMLInputElement;
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    await user.upload(input, invalidFile);

    expect(await screen.findByText(/invalid.*format/i)).toBeInTheDocument();
  });

  it('validates file size', async () => {
    const user = userEvent.setup();
    const mockOnUpload = vi.fn();
    const maxSize = 5 * 1024 * 1024; // 5MB
    render(<ImageUploader onUpload={mockOnUpload} maxSize={maxSize} />);

    const input = screen.getByLabelText(/choose files/i) as HTMLInputElement;
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    await user.upload(input, largeFile);

    expect(await screen.findByText(/file too large/i)).toBeInTheDocument();
  });

  it('shows upload progress', async () => {
    const user = userEvent.setup();
    const mockOnUpload = vi.fn();
    render(<ImageUploader onUpload={mockOnUpload} />);

    const input = screen.getByLabelText(/choose files/i) as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await user.upload(input, file);

    expect(await screen.findByText(/uploading/i)).toBeInTheDocument();
  });
});
