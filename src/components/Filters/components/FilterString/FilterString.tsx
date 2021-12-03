import React, { FC, useEffect, useState } from 'react';
import { Input } from '@keen.io/ui-core';
import { FilterSuggestions } from '../FilterSuggestions';

type Props = {
  onChange: (value: string) => void;
  value?: string;
  stringPlaceholder?: string;
  availableSuggestions?: string[];
};

const FilterString: FC<Props> = ({
  onChange,
  value,
  stringPlaceholder,
  availableSuggestions,
}) => {
  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>();

  useEffect(() => {
    if (value) {
      setSuggestionsVisible(true);
    }
  }, [value]);

  return (
    <>
      <Input
        data-testid="filter-value-input"
        variant="solid"
        value={value as string}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={stringPlaceholder}
      />
      {suggestionsVisible && availableSuggestions.length > 0 && (
        <FilterSuggestions
          suggestionsLoading={false}
          availableSuggestions={availableSuggestions}
          filterValue={value as string}
          onSelect={(value) => {
            onChange(value);
            setTimeout(() => setSuggestionsVisible(false), 0);
          }}
        />
      )}
    </>
  );
};

export default FilterString;
