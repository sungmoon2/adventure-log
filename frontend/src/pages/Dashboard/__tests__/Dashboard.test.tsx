import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Dashboard', () => {
  it('renders dashboard layout', () => {
    render(<Dashboard />, { wrapper });

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('displays must visit section for priority 1-2 places', async () => {
    render(<Dashboard />, { wrapper });

    expect(await screen.findByText(/must visit/i)).toBeInTheDocument();
  });

  it('shows statistics widgets', async () => {
    render(<Dashboard />, { wrapper });

    expect(await screen.findByText(/total places/i)).toBeInTheDocument();
    expect(screen.getByText(/visited/i)).toBeInTheDocument();
  });

  it('displays recent activity timeline', async () => {
    render(<Dashboard />, { wrapper });

    expect(await screen.findByText(/recent activity/i)).toBeInTheDocument();
  });

  it('shows quick action button', () => {
    render(<Dashboard />, { wrapper });

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });
});
