interface StatusFilterProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'want_to_visit', label: 'Want to Visit' },
    { value: 'visited', label: 'Visited' },
  ];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="status-filter" className="text-sm font-medium">
        Visit Status
      </label>
      <select
        id="status-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
}
