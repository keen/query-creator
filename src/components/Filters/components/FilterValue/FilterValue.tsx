/* eslint-disable @typescript-eslint/camelcase */

import React, { FC, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Coordinates,
  Operator,
  Property as PropertyType,
} from '../../../../types';
import { AppContext } from '../../../../contexts';
import { getQuery } from '../../../../modules/query';
import Property from '../../../Property';
import PropertyGroup, { PropertyItem } from '../../../PropertyGroup';

import { getValueComponent } from './getValueComponent';

type Props = {
  /** Type of property */
  propertyType: PropertyType;
  /** Change event handler */
  onChange: (
    value: string | boolean | number | Coordinates | Array<string | number>
  ) => void;
  /** Filter value */
  value?: string | boolean | number | Coordinates | Array<string | number>;
  /** Filter operator */
  operator?: Operator;
  /** Filter identifier */
  id: string;
  propertyName: string;
};

const FilterValue: FC<Props> = ({
  propertyType,
  operator,
  value,
  onChange,
  id,
  propertyName,
}) => {
  const { t } = useTranslation();
  const stringPlaceholder = t(
    'query_creator_filter_value.input_text_placeholder'
  );
  const query = useSelector(getQuery);
  const [availableSuggestions, setAvailableValues] = useState([]);
  const [availableValesLoading, setAvailableValuesLoading] = useState(false); // todo loader

  const { keenClient } = useContext(AppContext);
  console.log('availableValesLoading', availableValesLoading);

  useEffect(() => {
    if (propertyName) {
      const uniqueValuesQuery = {
        analysis_type: 'select_unique',
        event_collection: query.eventCollection,
        target_property: propertyName,
        timezone: query.timezone,
        group_by: [],
        limit: null,
        interval: null,
        timeframe: query.timeframe,
        zero_fill: null,
        filters: [],
      };
      setAvailableValuesLoading(true);
      keenClient
        .query(uniqueValuesQuery)
        .then((response) => {
          setAvailableValues(response.result);
        })
        .finally(() => {
          setAvailableValuesLoading(false);
        });
    }
  }, [propertyName]);

  return (
    <>
      {propertyType && operator ? (
        <>
          {getValueComponent({
            propertyType,
            operator,
            onChange,
            value,
            id,
            stringPlaceholder,
            availableSuggestions,
          })}
        </>
      ) : (
        <PropertyGroup isActive={false}>
          <PropertyItem>
            <Property
              placeholder={t('query_creator_filter_value.placeholder')}
            />
          </PropertyItem>
        </PropertyGroup>
      )}
    </>
  );
};

export default FilterValue;
