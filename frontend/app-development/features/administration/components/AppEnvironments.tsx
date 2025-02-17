import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStudioUrlParams } from 'app-shared/hooks/useStudioUrlParams';
import { useEnvironmentsQuery, useOrgListQuery } from 'app-development/hooks/queries';
import { AltinnSpinner } from 'app-shared/components';
import { ICreateAppDeploymentEnvObject } from 'app-development/sharedResources/appDeployment/types';
import { DeployEnvironment } from 'app-shared/types/DeployEnvironment';
import { AppStatus } from './AppStatus';
import { Alert } from '@digdir/design-system-react';
import { NoEnvironmentsAlert } from './NoEnvironmentsAlert';
import classes from './AppEnvironments.module.css';

export const AppEnvironments = () => {
  const { org } = useStudioUrlParams();
  const { t } = useTranslation();

  const {
    data: environmentList = [],
    isLoading: envIsLoading,
    isError: envIsError,
  } = useEnvironmentsQuery({ hideDefaultError: true });
  const {
    data: orgs = { orgs: {} },
    isLoading: orgsIsLoading,
    isError: orgsIsError,
  } = useOrgListQuery({ hideDefaultError: true });

  if (envIsLoading || orgsIsLoading) return <AltinnSpinner />;

  if (envIsError || orgsIsError)
    return <Alert severity='danger'>{t('administration.app_environments_error')}</Alert>;

  const selectedOrg = orgs.orgs[org];
  const hasNoEnvironments = !(selectedOrg?.environments?.length ?? 0);

  if (hasNoEnvironments) {
    return <NoEnvironmentsAlert />;
  }

  const orgEnvironments: ICreateAppDeploymentEnvObject[] = environmentList.filter(
    (env: DeployEnvironment) => selectedOrg.environments.includes(env.name),
  );

  return (
    <div className={classes.appEnvironments}>
      {orgEnvironments.map((orgEnvironment: DeployEnvironment) => {
        return (
          <AppStatus
            key={orgEnvironment.name}
            envName={orgEnvironment.name}
            envType={orgEnvironment.type}
          />
        );
      })}
    </div>
  );
};
