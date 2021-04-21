import React, { FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import {
  ActionButton,
  TitleComponent,
  MousePositionedTooltip,
} from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import FiltersComponent from './FiltersComponent';
import { ActionContainer, Wrapper } from './Filters.styles';

import { getSchemas, getSchemaLoading } from '../../modules/events';
import { AppState, Filter } from '../../types';
import { AppContext } from '../../contexts';

type Props = {
  /** Collection */
  collection: string;
  /** Filters */
  filters: Filter[];
  /** onReset handler */
  onReset?: () => void;
  /** onRemove handler */
  onRemove: (id: string) => void;
  /** onChange handler */
  onChange: (id: string, filter: Filter) => void;
  /** Add button onClick handler */
  onClick: (id: string) => void;
};

const Filters: FC<Props> = ({
  collection,
  filters,
  onReset,
  onRemove,
  onChange,
  onClick,
}) => {
  const { t } = useTranslation();
  const { modalContainer } = useContext(AppContext);

  const isSchemaExist = useSelector((state: AppState) => {
    const schemas = getSchemas(state);
    return schemas[collection];
  });
  const isSchemaLoading = useSelector((state: AppState) =>
    getSchemaLoading(state, collection)
  );

  const selectEventStreamTooltip = () => (
    <BodyText variant="body2" fontWeight="normal" color={colors.white[500]}>
      {t('query_creator_filters.select')}{' '}
      <strong>{t('query_creator_filters.event_stream')}</strong>{' '}
      {t('query_creator_filters.tooltip')}
    </BodyText>
  );

  return (
    <>
      <TitleComponent isDisabled={!collection}>
        {t('query_creator_filters.filters')}
      </TitleComponent>
      <Wrapper isDisabled={!collection}>
        {isSchemaExist && !isSchemaLoading && (
          <FiltersComponent
            collection={collection}
            filters={filters}
            onReset={onReset && onReset}
            onRemove={(id) => onRemove(id)}
            onChange={(id, filter) => onChange(id, filter)}
          />
        )}
        <MousePositionedTooltip
          isActive={!collection}
          tooltipTheme="dark"
          tooltipPortal={modalContainer}
          renderContent={selectEventStreamTooltip}
        >
          <ActionContainer hasSpacing={!!filters.length}>
            <ActionButton
              action="create"
              isDisabled={!collection}
              onClick={() => {
                const filterId = uuid();
                onClick(filterId);
              }}
            />
          </ActionContainer>
        </MousePositionedTooltip>
      </Wrapper>
    </>
  );
};

export default Filters;
