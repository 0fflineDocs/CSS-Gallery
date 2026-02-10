import * as ToggleGroup from '@radix-ui/react-toggle-group';
import type { ThemeCategory } from '../types/theme';
import type { ThemePreset } from '../types/theme';

interface FilterBarProps {
  selectedCategories: ThemeCategory[];
  onCategoryChange: (categories: ThemeCategory[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  themes: ThemePreset[];
}

const categories: { value: ThemeCategory; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'colorful', label: 'Colorful' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'brutalist', label: 'Brutalist' },
];

const activeClasses =
  'bg-white/[0.08] text-white border-white/[0.08]';
const inactiveClasses =
  'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-600';

const SearchIcon = () => (
  <svg
    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export function FilterBar({
  selectedCategories,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  themes,
}: FilterBarProps) {
  const isAll = selectedCategories.length === 0;

  const getCategoryCount = (cat: ThemeCategory) =>
    themes.filter((t) => t.category === cat).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => onCategoryChange([])}
          className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-colors duration-150 cursor-pointer ${
            isAll ? activeClasses : inactiveClasses
          }`}
          style={
            isAll
              ? { boxShadow: '0 0 12px rgba(139,92,246,0.15)' }
              : undefined
          }
        >
          All
        </button>

        <ToggleGroup.Root
          type="multiple"
          value={selectedCategories}
          onValueChange={(value) => onCategoryChange(value as ThemeCategory[])}
          className="flex flex-wrap gap-2.5"
        >
          {categories.map((cat) => {
            const count = getCategoryCount(cat.value);
            const isActive = selectedCategories.includes(cat.value);
            return (
              <ToggleGroup.Item
                key={cat.value}
                value={cat.value}
                className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-colors duration-150 cursor-pointer ${
                  isActive ? activeClasses : inactiveClasses
                }`}
                style={
                  isActive
                    ? { boxShadow: '0 0 12px rgba(139,92,246,0.15)' }
                    : undefined
                }
              >
                {cat.label} ({count})
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
      </div>

      <div className="relative max-w-xs">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search themes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.03] border border-slate-800 rounded-full text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
        />
      </div>
    </div>
  );
}
