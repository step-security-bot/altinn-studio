import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './ResourceDashboardPage.module.css';
import { Button, Spinner, Heading, Paragraph } from '@digdir/design-system-react';
import { PlusCircleIcon, MigrationIcon } from '@navikt/aksel-icons';
import { ResourceTable } from 'resourceadm/components/ResourceTable';
import { SearchBox } from 'resourceadm/components/ResourceSeachBox';
import { useGetResourceListQuery } from 'resourceadm/hooks/queries';
import { MergeConflictModal } from 'resourceadm/components/MergeConflictModal';
import { NewResourceModal } from 'resourceadm/components/NewResourceModal';
import { ImportResourceModal } from 'resourceadm/components/ImportResourceModal';
import { useRepoStatusQuery } from 'app-shared/hooks/queries';
import { filterTableData } from 'resourceadm/utils/resourceListUtils';
import { useTranslation } from 'react-i18next';
import { getResourcePageURL } from 'resourceadm/utils/urlUtils';

/**
 * @component
 *    Displays the page for the resource dashboard
 *
 * @returns {React.ReactNode} - The rendered component
 */
export const ResourceDashboardPage = (): React.ReactNode => {
  const { selectedContext } = useParams();
  const repo = `${selectedContext}-resources`;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [hasMergeConflict, setHasMergeConflict] = useState(false);

  const [newResourceModalOpen, setNewResourceModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Get metadata with queries
  const { data: repoStatus, refetch } = useRepoStatusQuery(selectedContext, repo);
  const {
    data: resourceListData,
    isLoading: resourceListLoading,
    isRefetching: refetchingList,
  } = useGetResourceListQuery(selectedContext);

  /**
   * Updates the value for if there is a merge conflict when the repostatus is not undefined
   */
  useEffect(() => {
    if (repoStatus) {
      setHasMergeConflict(repoStatus.hasMergeConflict);
    }
  }, [repoStatus]);

  const filteredResourceList = filterTableData(searchValue, resourceListData ?? []);

  const handleNavigateToResource = (id: string) => {
    navigate(getResourcePageURL(selectedContext, repo, id, 'about'));
  };
  /**
   * Display different content based on the loading state
   */
  const displayContent = () => {
    if (resourceListLoading || refetchingList) {
      return (
        <div className={classes.spinnerWrapper}>
          <Spinner size='xlarge' variant='interaction' title={t('resourceadm.dashboard_spinner')} />
        </div>
      );
    } else {
      return (
        <>
          <SearchBox onChange={(value: string) => setSearchValue(value)} />
          <div style={{ width: '100%' }}>
            <Heading size='xsmall' level={2}>
              {t('resourceadm.dashboard_num_resources', { num: resourceListData?.length ?? 0 })}
            </Heading>
          </div>
          <ResourceTable
            list={filteredResourceList}
            onClickEditResource={handleNavigateToResource}
          />
          {filteredResourceList.length === 0 && (
            <Paragraph size='small' className={classes.noResultText}>
              {t('resourceadm.dashboard_empty_list')}
            </Paragraph>
          )}
        </>
      );
    }
  };

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.topWrapper}>
        <Heading size='large' level={1}>
          {t('resourceadm.dashboard_header', { org: selectedContext })}
        </Heading>
        <div className={classes.topRightWrapper}>
          <Button
            variant='tertiary'
            color='second'
            icon={<MigrationIcon />}
            iconPlacement='right'
            onClick={() => setImportModalOpen(true)}
            size='medium'
          >
            <strong>{t('resourceadm.dashboard_import_resource')}</strong>
          </Button>
          <div className={classes.verticalDivider} />
          <Button
            variant='tertiary'
            color='second'
            icon={<PlusCircleIcon />}
            iconPlacement='right'
            onClick={() => setNewResourceModalOpen(true)}
            size='medium'
          >
            <strong>{t('resourceadm.dashboard_create_resource')}</strong>
          </Button>
        </div>
      </div>
      <div className={classes.horizontalDivider} />
      <div className={classes.componentWrapper}>{displayContent()}</div>
      {hasMergeConflict && (
        <MergeConflictModal
          isOpen={hasMergeConflict}
          handleSolveMerge={refetch}
          org={selectedContext}
          repo={repo}
        />
      )}
      <NewResourceModal
        isOpen={newResourceModalOpen}
        onClose={() => setNewResourceModalOpen(false)}
      />
      <ImportResourceModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </div>
  );
};
