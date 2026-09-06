import { useState } from 'react';
import type { SearchResult } from '../types';
import { useGlobalSearch } from '@hooks/useGlobalSearch';
import { searchSourceLabels } from '../constants/labels';
import {
  SearchDropdown,
  type SearchDropdownOption,
} from './inputs/SearchDropdown';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const { isSearching, results } = useGlobalSearch(query);
  const trimmedQuery = query.trim();
  const resultCountLabel = `${results.length} result${results.length === 1 ? '' : 's'} found`;
  const searchStatus =
    trimmedQuery.length < 2
      ? 'Enter at least two characters to search.'
      : isSearching
        ? 'Searching...'
        : resultCountLabel;
  const options: SearchDropdownOption<SearchResult>[] = results.map(
    (result) => ({
      key: `${result.source}-${result.id}`,
      value: result,
      label: result.title,
    }),
  );

  return (
    <section className="rounded-surface border-border-subtle bg-background-surface grid gap-4 border p-5">
      <div>
        <h2 className="text-heading-2 font-heading-2 leading-snug">
          Global lookup
        </h2>
        <p className="text-text-secondary" role="status">
          {searchStatus}
        </p>
      </div>

      <SearchDropdown
        label="Global search"
        value={query}
        options={options}
        placeholder="Search products, articles, tickets"
        minQueryLengthToOpen={2}
        onChange={setQuery}
        onSelect={(option) => setQuery(option.label)}
        optionTemplate={(option) => (
          <div className="grid gap-1">
            <span className="font-semibold">{option.value.title}</span>
            <span className="text-text-secondary text-xs">
              {searchSourceLabels[option.value.source]} - {option.value.id}
            </span>
          </div>
        )}
      />
    </section>
  );
}
