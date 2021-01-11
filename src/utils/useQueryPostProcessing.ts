import { InitialQuery } from '../modules/query';

export const useQueryPostProcessing = ({
  filters,
  orderBy,
  steps,
  propertyNames,
}: Partial<InitialQuery>) => !!(filters || orderBy || steps || propertyNames);
