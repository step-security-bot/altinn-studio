import React, { useMemo } from 'react';
import classes from './AppStatus.module.css';
import { useStudioUrlParams } from 'app-shared/hooks/useStudioUrlParams';
import { useAppDeploymentsQuery } from 'app-development/hooks/queries';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Heading, Paragraph } from '@digdir/design-system-react';
import { AltinnSpinner } from 'app-shared/components';
import { DeploymentStatus } from 'app-development/features/appPublish/components/appDeploymentComponent';
import { formatDateDDMMYY, formatTimeHHmm } from 'app-shared/pure/date-format';
import { IDeployment } from 'app-development/sharedResources/appDeployment/types';
import { getReleaseBuildPipelineLink } from 'app-development/utils/urlHelper';
import { publishPath } from 'app-shared/api/paths';

export type AppStatusProps = {
  envName: string;
  envType: string;
};

export const AppStatus = ({ envName, envType }: AppStatusProps) => {
  const { org, app } = useStudioUrlParams();
  const { t } = useTranslation();

  const {
    data: appDeployments = [],
    isLoading: deploysAreLoading,
    isError: deploysAreError,
  } = useAppDeploymentsQuery(org, app, { hideDefaultError: true });

  const deployHistory: IDeployment[] = appDeployments.filter((x) => x.envName === envName);

  const latestDeploy = deployHistory ? deployHistory[0] : null;
  const deploymentInEnv = deployHistory.find((d) => d.deployedInEnv);

  const { deployInProgress, deploymentStatus } = useMemo(() => {
    if (!latestDeploy) {
      return { deployInProgress: false, deploymentStatus: null };
    }

    if (latestDeploy.build.finished === null) {
      return { deployInProgress: true, deploymentStatus: DeploymentStatus.inProgress };
    }

    if (latestDeploy.build.finished && latestDeploy.build.result) {
      return { deployInProgress: false, deploymentStatus: latestDeploy.build.result };
    }

    return { deployInProgress: false, deploymentStatus: null };
  }, [latestDeploy]);

  const appDeployedAndReachable = !!deploymentInEnv;

  const deployFailed = latestDeploy && deploymentStatus === DeploymentStatus.failed;

  const deployedVersionNotReachable =
    latestDeploy && !appDeployedAndReachable && deploymentStatus === DeploymentStatus.succeeded;

  const noAppDeployed = !latestDeploy || deployInProgress;

  const formatDateTime = (dateAsString: string): string => {
    return t('general.date_time_format', {
      date: formatDateDDMMYY(dateAsString),
      time: formatTimeHHmm(dateAsString),
    });
  };

  if (deploysAreLoading) return <AltinnSpinner />;

  if (deploysAreError)
    return (
      <Alert severity='danger'>
        <Trans
          i18nKey={'administration.app_status_error'}
          values={{
            envName,
          }}
        />
      </Alert>
    );

  if (appDeployedAndReachable && !deployInProgress) {
    return (
      <DeploymentStatusInfo
        envType={envType}
        envName={envName}
        severity='success'
        content={t('administration.success')}
        footer={
          <Trans
            i18nKey={'administration.last_published'}
            values={{
              lastPublishedDate: formatDateTime(deploymentInEnv?.created),
            }}
          />
        }
      ></DeploymentStatusInfo>
    );
  }

  if (noAppDeployed || (deployFailed && !appDeployedAndReachable)) {
    return (
      <DeploymentStatusInfo
        envType={envType}
        envName={envName}
        severity='info'
        content={t('administration.no_app')}
        footer={
          <Trans i18nKey='administration.go_to_publish'>
            <a href={publishPath(org, app)} />
          </Trans>
        }
      />
    );
  }

  if (deployedVersionNotReachable) {
    return (
      <DeploymentStatusInfo
        envType={envType}
        envName={envName}
        severity='warning'
        content={t('administration.unavailable')}
        footer={
          <Trans i18nKey='administration.go_to_build_log'>
            <a href={getReleaseBuildPipelineLink(deploymentInEnv?.build.id)} />
          </Trans>
        }
      />
    );
  }
};

type DeploymentStatusInfoProps = {
  envType: string;
  envName: string;
  severity: 'success' | 'warning' | 'info';
  content: string;
  footer: string | JSX.Element;
};
const DeploymentStatusInfo = ({
  envType,
  envName,
  severity,
  content,
  footer,
}: DeploymentStatusInfoProps) => {
  const { t } = useTranslation();
  const isProduction = envType.toLowerCase() === 'production';
  const headingText = isProduction ? t('general.production') : envName;

  return (
    <Alert severity={severity} className={classes.alert}>
      <Heading spacing level={2} size='xsmall' className={classes.heading}>
        {headingText}
      </Heading>
      <Paragraph spacing size='small'>
        {content}
      </Paragraph>
      <Paragraph size='xsmall'>{footer}</Paragraph>
    </Alert>
  );
};
