import { AnalysisItem } from './types';

export const ANALYSIS_GROUPS: AnalysisItem[][] = [
  [
    {
      label: 'Average',
      value: 'average',
      description: 'query_creator_analysis_groups.average',
      index: 0,
    },
    {
      label: 'Count',
      value: 'count',
      description: 'query_creator_analysis_groups.count',
      index: 1,
    },
    {
      label: 'Count Unique',
      value: 'count_unique',
      description: 'query_creator_analysis_groups.count_unique',
      index: 2,
    },
  ],
  [
    {
      label: 'Extraction',
      value: 'extraction',
      description: 'query_creator_analysis_groups.extraction',
      index: 3,
    },
    {
      label: 'Funnel',
      value: 'funnel',
      description: 'query_creator_analysis_groups.funnel',
      index: 4,
    },
  ],
  [
    {
      label: 'Maximum',
      value: 'maximum',
      description: 'query_creator_analysis_groups.maximum',
      index: 5,
    },
    {
      label: 'Median',
      value: 'median',
      description: 'query_creator_analysis_groups.median',
      index: 6,
    },
    {
      label: 'Minimum',
      value: 'minimum',
      description: 'query_creator_analysis_groups.minimum',
      index: 7,
    },
  ],
  [
    {
      label: 'Percentile',
      value: 'percentile',
      description: 'query_creator_analysis_groups.percentile',
      index: 8,
    },
    {
      label: 'Select unique',
      value: 'select_unique',
      description: 'query_creator_analysis_groups.select_unique',
      index: 9,
    },
    {
      label: 'Standard deviation',
      value: 'standard_deviation',
      description: 'query_creator_analysis_groups.standard_deviation',
      index: 10,
    },
    {
      label: 'Sum',
      value: 'sum',
      description: 'query_creator_analysis_groups.sum',
      index: 11,
    },
  ],
];
