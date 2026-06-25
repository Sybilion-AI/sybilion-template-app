import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sybilion/uilib';

import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelect {
  placeholder: string;
  options: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  selects?: FilterSelect[];
  className?: string;
}

/**
 * Search + dropdown filter row built on uilib Input + Select. Wire `value`/`onChange`
 * to a useUrlState hook (P-03) so filters live in the URL, not component state.
 */
export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selects = [],
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {onSearchChange ? (
        <Input
          value={searchValue ?? ''}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-[220px]"
        />
      ) : null}
      {selects.map((select, index) => (
        <Select key={index} value={select.value} onValueChange={select.onChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={select.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {select.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
