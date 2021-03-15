import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleComponent } from '@keen.io/ui-core';

import {
  Container,
  MessageContainer,
  FullExtraction,
  FilteredExtraction,
  ClearProperties,
} from './ExtractionTitle.styles';

type Props = {
  /** Extracting all properties indicator */
  isFullExtraction: boolean;
  /** Disabled indicator */
  isDisabled: boolean;
  /** Clear properties event handler */
  onClearProperties: () => void;
};

const ExtractionTitle: FC<Props> = ({
  isFullExtraction,
  isDisabled,
  onClearProperties,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <TitleComponent isDisabled={isDisabled}>
        {t('extraction.title')}
      </TitleComponent>
      {!isDisabled && (
        <MessageContainer>
          {isFullExtraction ? (
            <FullExtraction>{t('extraction.full_extraction')}</FullExtraction>
          ) : (
            <FilteredExtraction>
              {t('extraction.filtered_extraction')}{' '}
              <ClearProperties role="button" onClick={onClearProperties}>
                {t('extraction.clear_properties')}
              </ClearProperties>
            </FilteredExtraction>
          )}
        </MessageContainer>
      )}
    </Container>
  );
};

export default ExtractionTitle;
