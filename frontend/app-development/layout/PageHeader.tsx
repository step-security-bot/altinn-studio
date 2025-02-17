import React from 'react';
import { AltinnHeader } from 'app-shared/components/altinnHeader/AltinnHeader';
import { getFilteredTopBarMenu } from './AppBar/appBarConfig';
import { getRepositoryType } from 'app-shared/utils/repository';
import { useAppSelector } from 'app-development/hooks';
import { previewPath, publishPath } from 'app-shared/api/paths';
import { AltinnButtonActionItem } from 'app-shared/components/altinnHeader/types';
import { GiteaHeader } from 'app-shared/components/GiteaHeader';
import { SettingsModalButton } from './SettingsModalButton';
import { TopBarMenu } from 'app-shared/enums/TopBarMenu';
import { User } from 'app-shared/types/User';

type SubMenuContentProps = {
  org: string;
  app: string;
};

export const subMenuContent = ({ org, app }: SubMenuContentProps) => {
  return (
    <GiteaHeader
      org={org}
      app={app}
      hasCloneModal
      leftComponent={<SettingsModalButton org={org} app={app} />}
    />
  );
};

export const buttonActions = (org: string, app: string): AltinnButtonActionItem[] => {
  const actions: AltinnButtonActionItem[] = [
    {
      title: 'top_menu.preview',
      path: previewPath,
      menuKey: TopBarMenu.Preview,
      buttonVariant: 'secondary',
      buttonColor: 'inverted',
      headerButtonsClasses: undefined,
      handleClick: () => (window.location.href = previewPath(org, app)),
    },
    {
      title: 'top_menu.deploy',
      path: publishPath,
      menuKey: TopBarMenu.Deploy,
      buttonVariant: 'secondary',
      headerButtonsClasses: undefined,
      handleClick: () => (window.location.href = publishPath(org, app)),
    },
  ];
  return actions;
};

type PageHeaderProps = {
  org: string;
  app: string;
  showSubMenu: boolean;
  user: User;
  isRepoError?: boolean;
};

export const PageHeader = ({ org, app, showSubMenu, user, isRepoError }: PageHeaderProps) => {
  const repoType = getRepositoryType(org, app);
  const repository = useAppSelector((state) => state.serviceInformation.repositoryInfo);
  const menuItems = getFilteredTopBarMenu(repoType);

  return (
    <AltinnHeader
      menuItems={menuItems}
      showSubMenu={showSubMenu && !isRepoError}
      subMenuContent={!isRepoError && subMenuContent({ org, app })}
      org={org}
      app={app}
      user={user}
      repository={repository}
      buttonActions={buttonActions(org, app)}
    />
  );
};
