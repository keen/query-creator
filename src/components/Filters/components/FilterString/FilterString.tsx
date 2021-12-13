import React, { FC, useRef, useState } from 'react';
import { Input } from '@keen.io/ui-core';
import { useOnClickOutside } from '@keen.io/react-hooks';

import { FilterSuggestions } from '../FilterSuggestions';
import { FilterStringWrapper } from './FilterString.styles';

type Props = {
  onChange: (value: string) => void;
  value?: string;
  stringPlaceholder?: string;
  suggestions?: string[];
  suggestionsVisible?: boolean;
  suggestionsLoading?: boolean;
};

const FilterString: FC<Props> = ({
  onChange,
  value,
  stringPlaceholder,
  suggestions,
  suggestionsVisible,
  suggestionsLoading,
}) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>();
  const filterString = useRef();

  const onInput = (e) => {
    const value = e.currentTarget.value;
    onChange(value);
    if (value && suggestionsVisible) {
      setShowSuggestions(true);
    }
  };

  useOnClickOutside(filterString, () => {
    setShowSuggestions(false);
  });

  return (
    <FilterStringWrapper ref={filterString}>
      <Input
        data-testid="filter-value-input"
        variant="solid"
        value={value as string}
        onChange={onInput}
        placeholder={stringPlaceholder}
      />
      <FilterSuggestions
        suggestionsLoading={suggestionsLoading}
        suggestionsVisible={showSuggestions}
        suggestions={suggestions}
        filterValue={value as string}
        onSelect={(value) => {
          if (value) {
            onChange(value);
          }
          setShowSuggestions(false);
        }}
      />
    </FilterStringWrapper>
  );
};

export default FilterString;
