import { OrderBy as OrderBySettings } from '../../../types';

export const filterSchema = (
  schema: Record<string, string>,
  groups: string[],
  orderBy?: OrderBySettings[]
) => {
  const obj = {};
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
