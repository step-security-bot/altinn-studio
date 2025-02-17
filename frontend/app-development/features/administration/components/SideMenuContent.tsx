import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@digdir/design-system-react';
import { formatNameAndDate } from 'app-shared/utils/formatDate';
import type { ICommit } from '../../../types/global';
import { RepositoryType } from 'app-shared/types/global';
import { ResetRepoModal } from './ResetRepoModal';
import { DownloadRepoModal } from './DownloadRepoModal';
import classes from './SideMenuContent.module.css';
import { useTranslation } from 'react-i18next';
import { useRepoStatusQuery } from 'app-shared/hooks/queries';
import type { Repository } from 'app-shared/types/Repository';
import { useStudioUrlParams } from 'app-shared/hooks/useStudioUrlParams';

interface ISideMenuContent {
  service: Repository;
  initialCommit: ICommit;
  repoType: RepositoryType;
}

export const SideMenuContent = (props: ISideMenuContent): JSX.Element => {
  const { org, app } = useStudioUrlParams();
  const [resetRepoModalOpen, setResetRepoModalOpen] = useState<boolean>(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const { data: repoStatus } = useRepoStatusQuery(org, app);
  const toggleDownloadModal = () => setDownloadModalOpen(!downloadModalOpen);
  const onCloseModal = () => setResetRepoModalOpen(false);
  const onClickResetRepo = () => setResetRepoModalOpen(true);

  useEffect(() => {
    if (
      repoStatus &&
      !(
        (repoStatus.aheadBy && repoStatus.aheadBy > 0) ||
        (repoStatus.contentStatus && repoStatus.contentStatus.length > 0)
      )
    ) {
      setResetRepoModalOpen(false);
    }
  }, [repoStatus]);

  const downloadModalAnchor = useRef<HTMLDivElement>();
  const resetRepoModalAnchor = useRef<HTMLDivElement>();
  const { t } = useTranslation();
  return (
    <div className={classes.container}>
      {/* App owner info */}
      <h3>{t('general.service_owner')}</h3>
      <div>
        {t(
          props.repoType === RepositoryType.Datamodels
            ? 'administration.repo_owner_is'
            : 'administration.service_owner_is',
        )}
      </div>
      <div>
        <img src={props.service.owner.avatar_url} style={{ maxHeight: '2em' }} alt='' />{' '}
        {props.service.owner.full_name || props.service.owner.login}
      </div>
      {props.initialCommit && (
        <div>
          {t('administration.created_by')}{' '}
          {formatNameAndDate(props.initialCommit.author.name, props.service.created_at)}
        </div>
      )}
      {/* Reset local repository */}
      <h3>{t('administration.reset_repo_heading')}</h3>
      <div style={{ paddingLeft: '18px' }}>
        <ul>
          <li>{t('administration.reset_repo_info_i1')}</li>
          <li>{t('administration.reset_repo_info_i2')}</li>
          <li>{t('administration.reset_repo_info_i3')}</li>
        </ul>
      </div>
      <Button
        color='second'
        id='reset-repo-button'
        onClick={onClickResetRepo}
        variant='secondary'
        size='small'
      >
        {t('administration.reset_repo_button')}
      </Button>
      <div ref={resetRepoModalAnchor} />
      <ResetRepoModal
        anchorRef={resetRepoModalAnchor}
        onClose={onCloseModal}
        open={resetRepoModalOpen}
        repositoryName={props.service.name}
        org={org}
      />
      {/* Download local repository */}
      <h3>{t('administration.download_repo')}</h3>
      <Button color='second' onClick={toggleDownloadModal} variant='secondary' size='small'>
        {t('administration.download_repo')}
      </Button>
      <div ref={downloadModalAnchor} />
      <DownloadRepoModal
        anchorRef={downloadModalAnchor}
        onClose={toggleDownloadModal}
        open={downloadModalOpen}
        org={org}
        app={app}
      />
    </div>
  );
};
