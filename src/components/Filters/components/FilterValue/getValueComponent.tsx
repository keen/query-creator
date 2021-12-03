import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, Input } from '@keen.io/ui-core';

import { Coordinates } from '../../../../types';
import { TYPES_CONFIG } from '../../constants';
import FilterListValue from '../FilterListValue';
import FilterBoolean from '../FilterBoolean';
import GeoCoordinates from '../GeoCoordinates';
import { FilterString } from '../FilterString';
import { GetComponent } from './types';

import { DatePickerContainer } from './FilterValue.styles';

export const getValueComponent = ({
  propertyType,
  operator,
  onChange,
  value,
  id,
  stringPlaceholder,
  availableSuggestions,
}: GetComponent) => {
  const { component } = TYPES_CONFIG[propertyType][operator];

  switch (component) {
    case 'null-placeholder':
      return null;
    case 'list':
      return (
        <FilterListValue
          items={value as string[]}
          propertyType={propertyType}
          onChange={onChange}
          availableSuggestions={availableSuggestions}
        />
      );
    case 'datepicker':
      return (
        <DatePickerContainer>
          <DatePicker
            date={new Date((value as string).substring(0, 19))}
            id={`datepicker_${id}`}
            onChange={(date: Date) =>
              onChange(
                `${dayjs(date.toString()).format('YYYY-MM-DDTHH:mm:ss')}Z`
              )
            }
          />
        </DatePickerContainer>
      );
    case 'boolean-switcher':
      return <FilterBoolean value={value as boolean} onChange={onChange} />;
    case 'geo-coordinates':
      return (
        <GeoCoordinates onChange={onChange} value={value as Coordinates} />
      );
    case 'input-number':
      return (
        <Input
          type="number"
          variant="solid"
          value={value as number}
          onChange={(e) => {
            const value = e.currentTarget.value
              ? parseFloat(e.currentTarget.value)
              : '';
            onChange(value);
          }}
        />
      );
    default:
      return (
        <FilterString
          onChange={onChange}
          value={value as string}
          availableSuggestions={availableSuggestions}
          stringPlaceholder={stringPlaceholder}
        />
      );
  }
};
