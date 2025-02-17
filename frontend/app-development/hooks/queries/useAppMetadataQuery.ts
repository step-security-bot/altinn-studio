import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useServicesContext } from 'app-shared/contexts/ServicesContext';
import type { ApplicationMetadata } from 'app-shared/types/ApplicationMetadata';
import { QueryKey } from 'app-shared/types/QueryKey';
import { AxiosError } from 'axios';

/**
 * Query to get the metadata of an app.
 *
 * @param org the organisation of the user
 * @param app the app the user is in
 *
 * @returns UseQueryResult with an object of Policy
 */
export const useAppMetadataQuery = (
  org: string,
  app: string
): UseQueryResult<ApplicationMetadata, AxiosError> => {
  const { getAppMetadata } = useServicesContext();

  return useQuery<ApplicationMetadata, AxiosError>([QueryKey.AppMetadata, org, app], () =>
    getAppMetadata(org, app)
  );
};
