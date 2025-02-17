import { QueryStatus } from '@tanstack/react-query';

/**
 * Merges multiple query statuses into one.
 * @param queryStatuses Query statuses to merge.
 * @returns Merged query status.
 */
export const mergeQueryStatuses = (...queryStatuses: QueryStatus[]): QueryStatus => {
  if (queryStatuses.includes('error')) return 'error';
  if (queryStatuses.includes('loading')) return 'loading';
  return 'success';
}
