import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IDeployment } from '../../sharedResources/appDeployment/types';
import { useServicesContext } from 'app-shared/contexts/ServicesContext';
import { AppDeployment } from 'app-shared/types/AppDeployment';
import { QueryKey } from 'app-shared/types/QueryKey';
import { DEPLOYMENTS_REFETCH_INTERVAL } from 'app-shared/constants';
import { QueryMeta } from '@tanstack/react-query/build/lib';

export const useAppDeploymentsQuery = (
  owner,
  app,
  meta?: QueryMeta,
): UseQueryResult<IDeployment[]> => {
  const { getDeployments } = useServicesContext();
  return useQuery<AppDeployment[]>({
    queryKey: [QueryKey.AppDeployments, owner, app],
    queryFn: () => getDeployments(owner, app).then((res) => res.results),
    refetchInterval: DEPLOYMENTS_REFETCH_INTERVAL,
    meta,
  });
};
