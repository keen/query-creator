import { OrderBy as OrderBySettings } from '../../../types';

import { useTranslation } from 'react-i18next';

export const filterSchema = (
  schema: Record<string, string>,
  groups: string[],
  orderBy?: OrderBySettings[]
) => {
  const { t } = useTranslation();
  const initialItem = {
    [t('query_creator_order_by.order_options_label')]: 'any',
  };
  const obj = { ...initialItem };
  groups.forEach((group) => {
    obj[group] = schema[group];
  });

  if (orderBy) {
    orderBy.map((item) => {
      if (obj[item.propertyName]) {
        delete obj[item.propertyName];
      }
    });
  }
  return obj;
};
