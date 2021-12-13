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
import { getFunnelSteps, getQuery } from '../../../../modules/query';
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
  /** Property name */
  propertyName: string;
  /** Funnel step id */
  funnelStepId?: string;
};

const FilterValue: FC<Props> = ({
  propertyType,
  operator,
  value,
  onChange,
  id,
  propertyName,
  funnelStepId,
}) => {
  const { t } = useTranslation();
  const stringPlaceholder = t(
    'query_creator_filter_value.input_text_placeholder'
  );
  let query = useSelector(getQuery);
  const { disableFilterSuggestions } = useContext(AppContext);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(
    !disableFilterSuggestions
  );

  const { keenClient } = useContext(AppContext);
  const steps = useSelector(getFunnelSteps);

  if (funnelStepId && steps.length > 0) {
    query = steps.find((step) => step.id === funnelStepId) as any;
  }

  useEffect(() => {
    if (propertyName && !disableFilterSuggestions) {
      const uniqueValuesQuery = {
        analysis_type: 'select_unique',
        event_collection: query.eventCollection,
        target_property: propertyName,
        timezone: query.timezone,
        timeframe: query.timeframe,
      };
      setSuggestionsLoading(true);
      keenClient
        .query(uniqueValuesQuery)
        .then((response) => setSuggestions(response.result))
        .finally(() => {
          setSuggestionsLoading(false);
        });
    }
  }, [propertyName, query.timezone, query.timeframe]);

  useEffect(() => {
    setSuggestionsVisible(
      ['contains', 'not_contains', 'eq', 'ne', 'in'].includes(operator) &&
        propertyType === 'String' &&
        !disableFilterSuggestions
    );
  }, [operator]);

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
            suggestions,
            suggestionsLoading,
            suggestionsVisible,
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
