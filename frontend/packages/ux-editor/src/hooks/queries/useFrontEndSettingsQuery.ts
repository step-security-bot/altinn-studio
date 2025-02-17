import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { useServicesContext } from 'app-shared/contexts/ServicesContext';
import { QueryKey } from 'app-shared/types/QueryKey';
import { IFrontEndSettings } from 'app-shared/types/global';

export const useFrontEndSettingsQuery = (
  org: string,
  app: string,
): UseQueryResult<IFrontEndSettings> => {
  const { getFrontEndSettings } = useServicesContext();
  return useQuery<IFrontEndSettings>([QueryKey.FrontEndSettings, org, app], () =>
    getFrontEndSettings(org, app),
  );
};
