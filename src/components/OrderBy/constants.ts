import { OrderBy } from '../../types';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

export const ORDER_OPTIONS = [
  {
    label: t('query_creator_order_by.order_options_label'),
    value: 'result',
  },
];

export const DIRECTION_LABELS = {
  ASC: 'Ascending',
  DESC: 'Descending',
};

export const DIRECTION_OPTIONS = [
  { label: 'DESC', value: 'DESC' },
  { label: 'ASC', value: 'ASC' },
];

export const DEFAULT_ORDER_SETTINGS = {
  propertyName: 'result',
  direction: 'ASC',
} as OrderBy;

export const DRAG_DELAY = 250;
export const DRAG_ANIMATION_TIME = 100;
