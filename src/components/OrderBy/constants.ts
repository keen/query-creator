import { OrderBy } from '../../types';

export const RESULT_PROPERTY_NAME = 'result';

export const ORDER_OPTIONS = [
  {
    label: RESULT_PROPERTY_NAME,
    value: RESULT_PROPERTY_NAME,
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
  propertyName: RESULT_PROPERTY_NAME,
  direction: 'ASC',
} as OrderBy;

export const DRAG_ANIMATION_TIME = 100;
