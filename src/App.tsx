import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'react-dates/initialize'; // todo remove this when rc-time-picker no longer used in monorepository time-picker component

import {
  ModifiersSettings,
  ModifiersItem,
  LimitContainer,
  Container,
} from './App.styles';

import {
  QueryArguments,
  Extraction,
  GroupBy,
  OrderBy,
  Interval,
  Limit,
  FunnelSteps,
  Filters,
} from './components';

import { showField } from './utils';

import {
  getEventCollection,
  getAnalysis,
  getFilters,
  removeFilter,
  addFilter,
  setFilters,
  updateFilter,
} from './modules/query';

import { Filter } from './types';

type Props = {
  /** Preview collection event handler */
  onPreviewCollection?: (collection: string) => void;
};

const App: FC<Props> = () => {
  const dispatch = useDispatch();
  const analysis = useSelector(getAnalysis);
  const collection = useSelector(getEventCollection);

  const filters = useSelector(getFilters);

  const modifiersItemSettings = {
    width: { xs: '100%', md: 'auto' },
  };

  const showOrderBy = showField('orderBy', analysis);
  const showLimit = showField('limit', analysis);

  return (
    <Container>
      <QueryArguments />
      {analysis === 'extraction' && <Extraction collection={collection} />}
      {showField('filters', analysis) && (
        <Filters
          collection={collection}
          filters={filters}
          onReset={() => dispatch(setFilters([]))}
          onRemove={(id: string) => dispatch(removeFilter(id))}
          onChange={(id: string, filter: Filter) =>
            dispatch(updateFilter(id, filter))
          }
          onClick={(id: string) => dispatch(addFilter(id))}
        />
      )}
      {showField('steps', analysis) && <FunnelSteps />}
      {!showField('steps', analysis) && (
        <>
          {showField('groupBy', analysis) && (
            <ModifiersItem {...modifiersItemSettings}>
              <GroupBy collection={collection} />
            </ModifiersItem>
          )}
          {(showLimit || showOrderBy) && (
            <ModifiersSettings flexDirection={{ xs: 'column', md: 'row' }}>
              {showOrderBy && (
                <ModifiersItem {...modifiersItemSettings}>
                  <OrderBy collection={collection} />
                </ModifiersItem>
              )}
              {showLimit && (
                <LimitContainer>
                  <Limit collection={collection} />
                </LimitContainer>
              )}
            </ModifiersSettings>
          )}
          {showField('interval', analysis) && <Interval />}
        </>
      )}
    </Container>
  );
};

export default App;
