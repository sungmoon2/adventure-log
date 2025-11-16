interface CategoryFilterProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'bar', label: 'Bar' },
    { value: 'tourist', label: 'Tourist Spot' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="category-filter" className="text-sm font-medium">
        Category
      </label>
      <select
        id="category-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
}
