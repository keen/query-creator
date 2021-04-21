import React, {
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useSelector } from 'react-redux';
import Sortable from 'sortablejs';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import {
  ActionButton,
  createTree,
  MousePositionedTooltip,
} from '@keen.io/ui-core';
import { useSearch } from '@keen.io/react-hooks';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import {
  PropertySettings,
  SortableContainer,
  Wrapper,
} from './ExtractionProperties.styles';
import ExtractionTitle from '../ExtractionTitle';

import SearchableProperty from '../../../SearchableProperty';

import { AppContext, SearchContext } from '../../../../contexts';

import { getCollectionSchema } from '../../../../modules/events';
import { mutateArray } from '../../../../utils';

import { DRAG_ANIMATION_TIME } from './constants';

import { AppState, ExtractionProperty } from '../../../../types';

type Props = {
  /** Collection of properties to extract */
  properties: ExtractionProperty[];
  /** Query event collection */
  collection: string;
  /** Set properties event handler */
  onSetProperties: (properties: ExtractionProperty[]) => void;
};

const ExtractionProperties: FC<Props> = ({
  properties,
  collection,
  onSetProperties,
}) => {
  const { t } = useTranslation();
  const { modalContainer } = useContext(AppContext);

  const [propertiesTree, setPropertiesTree] = useState(null);
  const [searchPropertiesPhrase, setSearchPhrase] = useState(null);
  const [expandTree, setTreeExpand] = useState(false);

  const propertiesRef = useRef(null);
  propertiesRef.current = properties;

  const {
    tree: schemaTree,
    list: schemaList,
  } = useSelector((state: AppState) => getCollectionSchema(state, collection));

  const { searchHandler } = useSearch<{
    path: string;
    type: string;
  }>(
    schemaList,
    (searchResult, phrase) => {
      if (phrase) {
        const searchTree = {};
        searchResult.forEach(({ path, type }) => {
          searchTree[path] = type;
        });
        setSearchPhrase(phrase);
        setPropertiesTree(createTree(searchTree));
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

  const updateProperty = useCallback(
    (propertySettings: ExtractionProperty) => {
      const propertiesSettings = properties.map((property) => {
        if (property.id === propertySettings.id) return propertySettings;
        return property;
      });
      onSetProperties(propertiesSettings);
    },
    [properties, onSetProperties]
  );

  const removeProperty = useCallback(
    (id: string) => {
      let propertiesSettings = properties.filter(
        (property) => property.id !== id
      );
      if (propertiesSettings.length === 0) propertiesSettings = undefined;
      onSetProperties(propertiesSettings);
    },
    [properties, onSetProperties]
  );

  const sortableRef = useRef(null);
  const [isDragged, setDragMode] = useState(false);

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
        const updatedGroups = mutateArray(
          propertiesRef.current,
          evt.oldIndex,
          evt.newIndex
        );
        onSetProperties(updatedGroups);
        setDragMode(false);

        if (dragGhost) dragGhost.parentNode.removeChild(dragGhost);
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

  const selectEventStreamTooltip = () => (
    <BodyText variant="body2" fontWeight="normal" color={colors.white[500]}>
      {t('query_creator_extraction_properties.select')}{' '}
      <strong>{t('query_creator_extraction_properties.event_stream')}</strong>{' '}
      {t('query_creator_extraction_properties.tooltip')}
    </BodyText>
  );

  return (
    <div>
      <ExtractionTitle
        isDisabled={!collection}
        isFullExtraction={properties.length === 0}
        onClearProperties={() => onSetProperties(undefined)}
      />
      <Wrapper>
        <SearchContext.Provider value={{ expandTree, searchPropertiesPhrase }}>
          <SortableContainer ref={sortableRef}>
            {properties.map(({ id, propertyName }) => (
              <PropertySettings key={id} data-testid="extraction-settings-item">
                <SearchableProperty
                  isEditAllowed={!isDragged}
                  properties={propertiesTree ? propertiesTree : schemaTree}
                  property={propertyName}
                  onSearchProperties={searchHandler}
                  onSelectProperty={(propertyName) => {
                    clearSearchHandler();
                    updateProperty({ id, propertyName });
                  }}
                  onBlur={() => {
                    if (!propertyName) removeProperty(id);
                  }}
                  onRemove={() => {
                    clearSearchHandler();
                    removeProperty(id);
                  }}
                />
              </PropertySettings>
            ))}
            <MousePositionedTooltip
              isActive={!collection}
              tooltipTheme="dark"
              tooltipPortal={modalContainer}
              renderContent={selectEventStreamTooltip}
            >
              <ActionButton
                className="add-button"
                isDisabled={!collection}
                action="create"
                onClick={() => {
                  const property = {
                    id: uuid(),
                    propertyName: '',
                  };

                  onSetProperties([...properties, property]);
                }}
              />
            </MousePositionedTooltip>
          </SortableContainer>
        </SearchContext.Provider>
      </Wrapper>
    </div>
  );
};

export default ExtractionProperties;
