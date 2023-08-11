import React, { useState } from 'react';
import { Button, ButtonVariant, Checkbox } from '@digdir/design-system-react';
import classes from './ConditionalRendering.module.css';
import { PlusIcon } from '@navikt/aksel-icons';
import { ConditionalRenderingModal } from '../toolbar/ConditionalRenderingModal';
import { OldDynamicsInfo } from './OldDynamicsInfo';
import { Divider } from 'app-shared/primitives';
import { useText } from '../../hooks';
import { _useIsProdHack } from 'app-shared/utils/_useIsProdHack';

type ConditionalRenderingProps = {
  onShowNewDynamics: (value: boolean) => void;
  showNewDynamics: boolean;
};

export const ConditionalRendering = ({ onShowNewDynamics, showNewDynamics }: ConditionalRenderingProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const t = useText();
  return (
    <>
    <div className={classes.conditionalRendering}>
      <div>
        <div className={classes.header}>
          <span>{t('right_menu.rules_conditional_rendering')}</span>
          <Button
            aria-label={t('right_menu.rules_conditional_rendering_add_alt')}
            className={classes.addIcon}
            icon={<PlusIcon />}
            onClick={() => setModalOpen(true)}
            variant={ButtonVariant.Quiet}
            size='small'
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
      <Divider marginless/>
      <OldDynamicsInfo />
    </div>
  <div className={classes.dynamicsVersionCheckBox}>
    <Divider />
    { !_useIsProdHack() &&
      <Checkbox
        label={t('right_menu.show_new_dynamics')}
        name={'checkbox-name'}
        checked={showNewDynamics}
        onChange={() => onShowNewDynamics(!showNewDynamics)}/>
    }
  </div>
    </>
  );
};
