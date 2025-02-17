import React from 'react';
import classes from './OldDynamicsInfo.module.css';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { giteaEditLink, altinnDocsUrl } from 'app-shared/ext-urls';
import { useStudioUrlParams } from 'app-shared/hooks/useStudioUrlParams';

export const OldDynamicsInfo = () => {
  const { t } = useTranslation();
  const { app, org } = useStudioUrlParams();
  const dynamicLocation = `App/ui/RuleHandler.js`;
  return (
    <div>
      <div className={classes.header}>{t('right_menu.dynamics')}</div>
      <div>
        <p>
          {t('right_menu.dynamics_description')}
          <br />
          <a
            className={classes.externalLink}
            href={altinnDocsUrl('/nb/app/development/logic/dynamic/')}
            rel='noopener noreferrer'
            target='_blank'
          >
            {t('right_menu.dynamics_link')}
            <span className={classes.externalLinkIcon}>
              <ExternalLinkIcon />
            </span>
          </a>
        </p>
        <a className={classes.textLink} href={giteaEditLink(org, app, dynamicLocation)} target='_blank' rel='noreferrer'>
          {t('right_menu.dynamics_edit')}
        </a>{' '}
        ({t('right_menu.dynamics_edit_comment')})
      </div>
    </div>
  );
};
