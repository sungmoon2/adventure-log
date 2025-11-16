interface PriorityFilterProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="priority-filter" className="text-sm font-medium">
        Priority
      </label>
      <select
        id="priority-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {priorities.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </select>
    </div>
  );
}
