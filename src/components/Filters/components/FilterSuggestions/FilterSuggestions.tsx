import React, { FC } from 'react';
import {
  Dropdown,
  DropdownList,
  DropdownListContainer,
} from '@keen.io/ui-core';

type Props = {
  suggestionsLoading: boolean;
  availableSuggestions: string[];
  filterValue: string;
  onSelect: (value: string) => void;
  selectedItems?: string[];
};

const FilterSuggestions: FC<Props> = ({
  suggestionsLoading,
  availableSuggestions,
  filterValue,
  onSelect,
  selectedItems,
}) => {
  const filteredSuggestions = availableSuggestions
    ? availableSuggestions.filter((suggestion) =>
        suggestion.startsWith(filterValue)
      )
    : [];
  return (
    <Dropdown isOpen={true} fullWidth={true}>
      {suggestionsLoading && 'Loading...'}
      {filterValue && filteredSuggestions.length > 0 && (
        <DropdownListContainer scrollToActive maxHeight={240}>
          {(activeItemRef) => (
            <DropdownList
              ref={activeItemRef}
              items={filteredSuggestions.map((value) => ({
                label: value,
                value,
              }))}
              setActiveItem={({ value }) => {
                return (
                  selectedItems &&
                  selectedItems.length > 0 &&
                  selectedItems.includes(value)
                );
              }}
              onClick={(_e, { value }) => {
                onSelect(value);
              }}
            />
          )}
        </DropdownListContainer>
      )}
    </Dropdown>
  );
};

export default FilterSuggestions;
