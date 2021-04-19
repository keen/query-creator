import React, { FC, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Input,
  TitleComponent,
  MousePositionedTooltip,
} from '@keen.io/ui-core';

import { Wrapper } from './Limit.styles';

import {
  setLimit,
  getLimit,
  getGroupBy,
  getOrderBy,
} from '../../modules/query';

import { AppContext } from '../../contexts';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';

type Props = {
  /** Collection name */
  collection: string;
};

const Limit: FC<Props> = ({ collection }) => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);

  const { t } = useTranslation();
  const limit = useSelector(getLimit);
  const groupBy = useSelector(getGroupBy);
  const orderBy = useSelector(getOrderBy);
  const isDisabled = !groupBy || !orderBy;

  const changeHandler = useCallback((eventValue) => {
    if (eventValue) {
      const limitValue = parseInt(eventValue);
      dispatch(setLimit(limitValue));
    } else {
      dispatch(setLimit(undefined));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setLimit(undefined));
    };
  }, []);

  useEffect(() => {
    if (isDisabled) {
      dispatch(setLimit(undefined));
    }
  }, [isDisabled]);

  const selectAndOrderDataTooltip = () => (
    <BodyText variant="body2" fontWeight="normal" color={colors.white[500]}>
      {collection ? (
        <span data-testid="order-data-tooltip">
          <strong>{t('query_creator_limit.order')}</strong>{' '}
          {t('query_creator_limit.limit_result')}
        </span>
      ) : (
        <span data-testid="select-event-stream-tooltip">
          {t('query_creator_limit.select')}{' '}
          <strong>{t('query_creator_limit.event_stream')}</strong>{' '}
          {t('query_creator_limit.tooltip')}
        </span>
      )}
    </BodyText>
  );

  return (
    <>
      <TitleComponent isDisabled={isDisabled}>
        {t('query_creator_limit.label')}
      </TitleComponent>
      <MousePositionedTooltip
        isActive={isDisabled}
        tooltipTheme="dark"
        tooltipPortal={modalContainer}
        renderContent={selectAndOrderDataTooltip}
      >
        <Wrapper data-testid="limit-wrapper">
          <Input
            disabled={isDisabled}
            type="number"
            variant="solid"
            data-testid="limit"
            id="limit"
            placeholder={t('query_creator_limit.placeholder')}
            value={limit ? limit : ''}
            onChange={(e) => changeHandler(e.target.value)}
          />
        </Wrapper>
      </MousePositionedTooltip>
    </>
  );
};

export default Limit;
