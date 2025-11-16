interface RegionFilterProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function RegionFilter({ value, onChange }: RegionFilterProps) {
  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'seoul', label: 'Seoul' },
    { value: 'busan', label: 'Busan' },
    { value: 'incheon', label: 'Incheon' },
    { value: 'daegu', label: 'Daegu' },
    { value: 'gwangju', label: 'Gwangju' },
    { value: 'daejeon', label: 'Daejeon' },
    { value: 'ulsan', label: 'Ulsan' },
    { value: 'sejong', label: 'Sejong' },
    { value: 'gyeonggi', label: 'Gyeonggi' },
    { value: 'gangwon', label: 'Gangwon' },
    { value: 'chungbuk', label: 'Chungcheongbuk' },
    { value: 'chungnam', label: 'Chungcheongnam' },
    { value: 'jeonbuk', label: 'Jeollabuk' },
    { value: 'jeonnam', label: 'Jeollanam' },
    { value: 'gyeongbuk', label: 'Gyeongsangbuk' },
    { value: 'gyeongnam', label: 'Gyeongsangnam' },
    { value: 'jeju', label: 'Jeju' },
  ];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="region-filter" className="text-sm font-medium">
        Region
      </label>
      <select
        id="region-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
    </div>
  );
}
