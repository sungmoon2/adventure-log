import { Search, X } from 'lucide-react';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  isSearching?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, isSearching = false, value, className = '', ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className={`relative ${className}`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={20} className={isSearching ? 'animate-pulse' : ''} />
        </div>

        <input
          ref={ref}
          type="text"
          value={value}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...props}
        />

        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
