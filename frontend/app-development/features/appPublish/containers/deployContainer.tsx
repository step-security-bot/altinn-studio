import React, { useEffect, useMemo, useState } from 'react';
import classes from './deployContainer.module.css';
import moment from 'moment';
import type { IAppClusterState } from '../../../sharedResources/appCluster/appClusterSlice';
import type { IAppDeploymentState } from '../../../sharedResources/appDeployment/appDeploymentSlice';
import type { IConfigurationState } from '../../../sharedResources/configuration/configurationSlice';
import type { ICreateAppDeploymentErrors } from '../../../sharedResources/appDeployment/types';
import { AltinnContentLoader } from 'app-shared/components/molecules/AltinnContentLoader';
import { AppDeploymentActions } from '../../../sharedResources/appDeployment/appDeploymentSlice';
import { AppDeploymentComponent } from '../components/appDeploymentComponent';
import { BuildResult } from '../../../sharedResources/appRelease/types';
import { ConfigurationActions } from '../../../sharedResources/configuration/configurationSlice';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { useParams } from 'react-router-dom';
import {
  getDeploymentsStartInterval,
  getDeploymentsStopInterval,
} from '../../../sharedResources/appCluster/appClusterSlice';
import { useAppReleases, useFrontendLang, useOrgList } from '../contexts/services/queryHooks';

export const DeployContainerComponent = () => {
  const { org, app } = useParams();
  const dispatch = useAppDispatch();

  const [environments, setEnvironments] = useState([]);
  const [imageOptions, setImageOptions] = useState([]);

  const appCluster: IAppClusterState = useAppSelector((state) => state.appCluster);
  const appDeployments: IAppDeploymentState = useAppSelector((state) => state.appDeployments);
  const createAppDeploymentErrors: any = useAppSelector(
    (state) => state.appDeployments.createAppDeploymentErrors
  );

  const configuration: IConfigurationState = useAppSelector((state) => state.configuration);
  const { data: releases } = useAppReleases(org, app);
  const { data: orgs = { orgs: {} } } = useOrgList();
  const { data: language = {} } = useFrontendLang('nb');
  const deployPermissions: string[] = useAppSelector(
    (state) => state.userState.permissions.deploy.environments
  );
  const orgName: string = useMemo(() => {
    let name = '';
    if (orgs.orgs && orgs.orgs[org]) {
      name = orgs.orgs[org].name.nb;
    }
    return name;
  }, [org, orgs]);

  useEffect(() => {
    dispatch(ConfigurationActions.getEnvironments());
    dispatch(AppDeploymentActions.getAppDeploymentsStartInterval());

    return () => {
      dispatch(AppDeploymentActions.getAppDeploymentsStopInterval());
      dispatch(getDeploymentsStopInterval());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      !!orgs.orgs &&
      !!orgs.orgs[org] &&
      !!orgs.orgs[org].environments &&
      !!configuration.environments.result
    ) {
      setEnvironments(
        orgs.orgs[org].environments
          .map((envName: string) =>
            configuration.environments.result.find((env: any) => env.name === envName)
          )
          .filter((element: any) => element != null)
      );
    }
  }, [orgs, org, configuration]);

  useEffect(() => {
    if (environments.length) {
      dispatch(getDeploymentsStartInterval());
    } else {
      dispatch(getDeploymentsStopInterval());
    }
  }, [environments, dispatch, appDeployments]);

  useEffect(() => {
    const tempImages = releases
      .filter((image) => image.build.result === BuildResult.succeeded)
      .map((image) => {
        const releaseTime = moment(new Date(image.created)).format('DD.MM.YY [kl.] HH:mm');
        return {
          value: image.tagName,
          label: `Version ${image.tagName} (${releaseTime})`,
        };
      });
    setImageOptions(tempImages);
  }, [releases]);

  const isLoading = (): boolean => {
    return !environments.length || !appDeployments.deployments || !deployableImages || !language;
  };

  if (isLoading()) {
    return (
      <div className={classes.deployContainer}>
        <AltinnContentLoader width={900} height={320}>
          <rect x='60' y='13' rx='0' ry='0' width='650' height='76' />
          <rect x='60' y='110' rx='0' ry='0' width='333' height='44' />
          <rect x='60' y='171' rx='0' ry='0' width='202' height='41' />
          <rect x='487' y='111' rx='0' ry='0' width='220' height='42' />
        </AltinnContentLoader>
      </div>
    );
  }

  return (
    <div className={classes.deployContainer}>
      {environments.map((env: any, index: number) => {
        return (
          <AppDeploymentComponent
            key={index}
            envName={env.name}
            envObj={env}
            urlToApp={`https://${org}.${env.appPrefix}.${env.hostname}/${org}/${app}/`}
            urlToAppLinkTxt={`${org}.${env.appPrefix}.${env.hostname}/${org}/${app}/`}
            deploymentList={
              appCluster.deploymentList &&
              appCluster.deploymentList.find((elem: any) => elem.env === env.name)
            }
            releases={imageOptions}
            deployHistory={appDeployments.deployments.filter(
              (deployment: any) => deployment.envName === env.name
            )}
            deployError={createAppDeploymentErrors.filter(
              (error: ICreateAppDeploymentErrors) => error.env === env.name
            )}
            language={language}
            deployPermission={
              deployPermissions.findIndex((e) => e.toLowerCase() === env.name.toLowerCase()) > -1
            }
            orgName={orgName}
          />
        );
      })}
    </div>
  );
};
