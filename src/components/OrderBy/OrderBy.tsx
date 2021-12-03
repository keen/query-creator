import React, {
  FC,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'shallowequal';
import { v4 as uuid } from 'uuid';
import Sortable from 'sortablejs';
import { useTranslation } from 'react-i18next';
import {
  ActionButton,
  TitleComponent,
  createTree,
  MousePositionedTooltip,
} from '@keen.io/ui-core';
import { useSearch } from '@keen.io/react-hooks';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';

import { OrderByProperty } from './components';
import { DRAG_ANIMATION_TIME, RESULT_PROPERTY_NAME } from './constants';
import { OrderDirection } from './types';
import { filterSchema, createListFromSchema } from './utils';
import { Section, SortableContainer, OrderByContainer } from './OrderBy.styles';

import { mutateArray } from '../../utils';
import { setOrderBy, getGroupBy, getOrderBy } from '../../modules/query';
import { getCollectionSchema } from '../../modules/events';
import { AppContext, SearchContext } from '../../contexts';
import { AppState, OrderBy as OrderBySettings } from '../../types';

type Props = {
  /** Collection name */
  collection: string;
};

const OrderBy: FC<Props> = ({ collection }) => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);
  const { t } = useTranslation();
  const groups: string[] = useSelector((state: AppState) => {
    const groupBy = getGroupBy(state);
    if (groupBy) {
      if (Array.isArray(groupBy)) return groupBy;
      if (typeof groupBy === 'string') return [groupBy];
    }
    return [];
  }, shallowEqual);

  const { schema } = useSelector((state: AppState) =>
    getCollectionSchema(state, collection)
  );

  const orderBy = useSelector((state: AppState) => getOrderBy(state));
  const orderByRef = useRef(orderBy);
  const isResultPropertyChosen = !!orderBy?.find(
    (el) => el.propertyName === RESULT_PROPERTY_NAME
  );

  const sortableRef = useRef(null);

  const [propertiesTree, setPropertiesTree] = useState(null);
  const [searchPropertiesPhrase, setSearchPhrase] = useState(null);
  const [expandTree, setTreeExpand] = useState(false);
  const [isDragged, setDragMode] = useState(false);

  const filteredSchema = filterSchema(schema, groups, orderBy);

  const resultObject = {
    [t('query_creator_order_by.order_options_label')]: [
      RESULT_PROPERTY_NAME,
      'any',
    ],
  };

  const { searchHandler } = useSearch<{
    path: string;
    type: string;
  }>(
    createListFromSchema(filteredSchema),
    (searchResult, phrase) => {
      if (phrase) {
        const searchTree = {};
        searchResult.forEach(({ path, type }) => {
          searchTree[path] = type;
        });
        setSearchPhrase(phrase);
        setPropertiesTree({ ...createTree(searchTree), ...resultObject });
        setTreeExpand(true);
      } else {
        setTreeExpand(false);
        setPropertiesTree(null);
      }
    },
    {
      keys: ['path', 'type'],
      threshold: 0.4,
    }
  );

  const clearSearchHandler = useCallback(() => {
    setPropertiesTree(null);
    setSearchPhrase(null);
  }, []);

  const updateOrderBy = useCallback(
    (orderSettings: OrderBySettings, id: string) => {
      const orderBySettings = orderBy.map((order) => {
        if (order.id === id) return orderSettings;
        return order;
      });
      dispatch(setOrderBy(orderBySettings));
    },
    [orderBy]
  );

  const removeOrderBy = useCallback(
    (id: string) => {
      let orderBySettings = orderBy.filter((order) => order.id !== id);
      if (orderBySettings.length === 0) orderBySettings = undefined;
      dispatch(setOrderBy(orderBySettings));
    },
    [orderBy]
  );

  const showOrderOptions = useMemo(
    () => groups.filter((group) => group).length,
    [groups]
  );

  useEffect(() => {
    orderByRef.current = orderBy;
  }, [orderBy]);

  useEffect(() => {
    let dragGhost;
    new Sortable(sortableRef.current, {
      animation: DRAG_ANIMATION_TIME,
      filter: '.add-button',
      handle: '.drag-handle',
      onStart: () => {
        setDragMode(true);
        setTreeExpand(false);
      },
      onMove: (evt) => !evt.related.className.includes('add-button'),
      onEnd: (evt) => {
        if (orderByRef.current) {
          const updatedGroups = mutateArray(
            orderByRef.current,
            evt.oldIndex,
            evt.newIndex
          );
          dispatch(setOrderBy(updatedGroups));
          setDragMode(false);

          if (dragGhost) dragGhost.parentNode.removeChild(dragGhost);
        }
      },
      setData: (dataTransfer, dragEl) => {
        dragGhost = dragEl.cloneNode(true);
        const styles = {
          width: dragEl.offsetWidth,
          transform: 'translateX(-100%)',
          position: 'absolute',
        };
        Object.assign(dragGhost.style, styles);

        const tree = dragGhost.querySelector('[data-testid="properties-tree"]');
        if (tree) tree.remove();

        document.body.appendChild(dragGhost);
        dataTransfer.setDragImage(dragGhost, 10, 10);
      },
    });
  }, []);

  const isActionButtonDisabled = () =>
    (!showOrderOptions ||
      !Object.keys(filteredSchema).length ||
      (orderBy && orderBy.some((item) => !item.propertyName))) &&
    isResultPropertyChosen;

  const selectAndGroupDataTooltip = () => (
    <BodyText variant="body2" fontWeight="normal" color={colors.white[500]}>
      {collection ? (
        <span data-testid="select-group-by">
          {t('query_creator_order_by.define')}{' '}
          <strong>{t('query_creator_order_by.group_by')}</strong>{' '}
          {t('query_creator_order_by.order_result')}
        </span>
      ) : (
        <span data-testid="select-event-stream">
          {t('query_creator_order_by.select')}{' '}
          <strong>{t('query_creator_order_by.event_stream')}</strong>{' '}
          {t('query_creator_order_by.tooltip')}
        </span>
      )}
    </BodyText>
  );

  return (
    <>
      <TitleComponent isDisabled={!showOrderOptions}>
        {t('query_creator_order_by.title')}
      </TitleComponent>
      <MousePositionedTooltip
        isActive={!showOrderOptions}
        tooltipPortal={modalContainer}
        tooltipTheme={'dark'}
        renderContent={selectAndGroupDataTooltip}
      >
        <Section data-testid="order-by-wrapper">
          <SearchContext.Provider
            value={{ expandTree, searchPropertiesPhrase }}
          >
            <SortableContainer ref={sortableRef}>
              {orderBy &&
                orderBy.map(({ propertyName, direction, id }) => (
                  <OrderByContainer key={id}>
                    <OrderByProperty
                      property={
                        propertyName === 'result'
                          ? t('query_creator_order_by.order_options_label')
                          : propertyName
                      }
                      orderDirection={direction}
                      isEditAllowed={!isDragged}
                      properties={
                        propertiesTree
                          ? propertiesTree
                          : {
                              ...createTree(filteredSchema),
                              ...(isResultPropertyChosen ? {} : resultObject),
                            }
                      }
                      onSelectDirection={(value: OrderDirection) => {
                        const orderSettings = {
                          id,
                          propertyName,
                          direction: value,
                        };
                        updateOrderBy(orderSettings as OrderBySettings, id);
                      }}
                      onSelectProperty={(value: string) => {
                        clearSearchHandler();
                        const orderSettings = {
                          id,
                          propertyName: value,
                          direction,
                        };
                        updateOrderBy(orderSettings as OrderBySettings, id);
                      }}
                      onSearchProperties={searchHandler}
                      onBlur={() => {
                        if (!propertyName) removeOrderBy(id);
                      }}
                      onRemove={() => {
                        clearSearchHandler();
                        removeOrderBy(id);
                      }}
                    />
                  </OrderByContainer>
                ))}
              <ActionButton
                className="add-button"
                isDisabled={isActionButtonDisabled()}
                action="create"
                onClick={() => {
                  const currentSettings = orderBy || [];
                  dispatch(
                    setOrderBy([
                      ...currentSettings,
                      { id: uuid(), propertyName: '', direction: 'DESC' },
                    ])
                  );
                }}
              />
            </SortableContainer>
          </SearchContext.Provider>
        </Section>
      </MousePositionedTooltip>
    </>
  );
};

export default OrderBy;
