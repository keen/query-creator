import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Dropdown,
  DropableContainer,
  DropableContainerVariant as Variant,
  DropdownList,
  DropdownListContainer,
  TitleComponent,
  EmptySearch,
  KEYBOARD_KEYS,
} from '@keen.io/ui-core';
import { useSearch } from '@keen.io/react-hooks';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Container } from './EventCollection.styles';

import { getEventsCollections } from '../../modules/events';

type Props = {
  /** Collection identifer */
  collection: string;
  /** Collection change event handler */
  onChange: (collection: string) => void;
  /** Reset event handler */
  onReset?: () => void;
  /** Container variant */
  variant?: Variant;
  /** Error */
  hasError?: boolean;
};

const EventCollection: FC<Props> = ({
  collection,
  onChange,
  onReset,
  variant = 'secondary',
  hasError = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);

  const collections = useSelector(getEventsCollections);
  const options = useMemo(
    () =>
      collections.map((name) => ({
        label: name,
        value: name,
      })),
    [collections]
  );

  const [collectionsList, setCollectionsList] = useState(options);

  const collectionListRef = useRef(collectionsList);
  const selectionIndexRef = useRef(selectionIndex);

  selectionIndexRef.current = selectionIndex;
  collectionListRef.current = collectionsList;

  const keyboardHandler = useCallback(
    (e: KeyboardEvent) => {
      const { current: optionsList } = collectionListRef;
      switch (e.keyCode) {
        case KEYBOARD_KEYS.ENTER:
          if (optionsList && optionsList.length) {
            const { value } = optionsList[selectionIndexRef.current];
            onChange(value);
          }
          setOpen(false);
          break;
        case KEYBOARD_KEYS.UP:
          if (selectionIndexRef.current === null) {
            setIndex(0);
          } else if (selectionIndexRef.current > 0) {
            setIndex(selectionIndexRef.current - 1);
          }
          break;
        case KEYBOARD_KEYS.DOWN:
          if (selectionIndexRef.current === null) {
            setIndex(0);
          } else if (selectionIndexRef.current < optionsList.length - 1) {
            setIndex(selectionIndexRef.current + 1);
          }
          break;
        case KEYBOARD_KEYS.ESCAPE:
          setOpen(false);
          break;
      }
    },
    [collectionsList]
  );

  const { searchHandler, searchPhrase, clearSearchPhrase } = useSearch<{
    label: string;
    value: string;
  }>(options, (searchResult, phrase) => {
    setIndex(null);
    if (phrase) {
      setCollectionsList(searchResult);
    } else {
      setCollectionsList(options);
    }
  });

  useEffect(() => {
    if (isOpen) {
      const index = options.findIndex(({ value }) => value === collection);
      setIndex(index);
      document.addEventListener('keydown', keyboardHandler);
    } else {
      setCollectionsList(options);
      clearSearchPhrase();
    }

    return () => {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [isOpen]);

  useEffect(() => {
    setCollectionsList(options);
  }, [options]);

  useEffect(() => {
    return () => {
      if (onReset) onReset();
    };
  }, []);

  return (
    <Container>
      <TitleComponent
        data-testid="event-collection-title"
        onClick={() => setOpen(true)}
        hasError={hasError}
      >
        {t('query_creator_event_collection.label')}
      </TitleComponent>
      <DropableContainer
        variant={variant}
        hasError={hasError}
        searchPlaceholder={t(
          'query_creator_event_collection.search_placeholder'
        )}
        placeholder={t('query_creator_event_collection.placeholder')}
        onClick={() => !isOpen && setOpen(true)}
        isActive={isOpen}
        value={collection}
        searchable
        dropIndicator
        onSearch={searchHandler}
        onDefocus={() => {
          setOpen(false);
        }}
      >
        <BodyText variant="body2" color={colors.blue[500]} enableTextEllipsis>
          {collection}
        </BodyText>
      </DropableContainer>
      <Dropdown isOpen={isOpen}>
        {searchPhrase && !collectionsList.length ? (
          <EmptySearch
            message={t('query_creator_event_collection.empty_search_results')}
          />
        ) : (
          <DropdownListContainer scrollToActive maxHeight={240}>
            {(activeItemRef) => (
              <DropdownList
                ref={activeItemRef}
                items={collectionsList}
                setActiveItem={(_item, idx) => selectionIndex === idx}
                onClick={(_e, { value }) => {
                  if (collection !== value) {
                    onChange(value);
                  }
                  setCollectionsList(options);
                }}
              />
            )}
          </DropdownListContainer>
        )}
      </Dropdown>
    </Container>
  );
};

export default EventCollection;
