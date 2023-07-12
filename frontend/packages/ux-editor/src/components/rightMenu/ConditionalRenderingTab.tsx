import React, { useState } from 'react';
import { Alert, Button, ButtonVariant } from '@digdir/design-system-react';
import classes from './ConditionalRenderingTab.module.css';
import { PlusIcon } from '@navikt/aksel-icons';
import { ConditionalRenderingModal } from '../toolbar/ConditionalRenderingModal';
import { Dynamics } from './Dynamics';
import { Divider } from 'app-shared/primitives';
import { useText } from '../../hooks';

export const ConditionalRenderingTab = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const t = useText();
  return (
    <div className={classes.conditionalRendering}>
      <Alert severity='warning'>
        {t('right_menu.rules_conditional_rendering_info')}
        <a
          href='https://docs.altinn.studio/nb/app/development/logic/expressions/'
          target='_blank'
          rel='noreferrer'
        >
          {t('right_menu.rules_conditional_rendering_info_link')}
        </a>
        {t('right_menu.rules_conditional_rendering_info_how_to_use')}
        {t('right_menu.rules_conditional_rendering_info_deprecated')}
      </Alert>
      <div>
        <div className={classes.header}>
          <span>{t('right_menu.rules_conditional_rendering')}</span>
          <Button
            aria-label={t('right_menu.rules_conditional_rendering_add_alt')}
            className={classes.addIcon}
            icon={<PlusIcon />}
            onClick={() => setModalOpen(true)}
            variant={ButtonVariant.Quiet}
          />
        </div>
        <div>
          <ConditionalRenderingModal
            modalOpen={modalOpen}
            handleClose={() => setModalOpen(false)}
            handleOpen={() => setModalOpen(true)}
          />
        </div>
      </div>
      <Divider marginless />
      <Dynamics />
    </div>
  );
};
