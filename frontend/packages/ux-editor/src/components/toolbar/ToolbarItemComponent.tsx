import React, { MouseEvent } from 'react';
import classes from './ToolbarItemComponent.module.css';
import { Button } from '@digdir/design-system-react';
import { InformationIcon } from '@navikt/aksel-icons';
import { getComponentTitleByComponentType } from '../../utils/language';
import { useTranslation } from 'react-i18next';
import { ComponentType } from 'app-shared/types/ComponentType';

export interface IToolbarItemProvidedProps {
  componentType: ComponentType;
  onClick: (type: ComponentType, event: MouseEvent) => void;
  thirdPartyLabel?: string;
  icon?: string | React.ComponentType;
}

export const ToolbarItemComponent = (props: IToolbarItemProvidedProps) => {
  const { t } = useTranslation();
  return (
    <div className={classes.toolbarItem}>
      <div className={classes.componentIcon}>{props.icon && <props.icon />}</div>
      <div className={classes.componentLabel}>
        {props.thirdPartyLabel == null
          ? getComponentTitleByComponentType(props.componentType, t)
          : props.thirdPartyLabel}
      </div>
      <div className={classes.componentHelpIcon}>
        <Button
          onClick={(e) => props.onClick(props.componentType, e)}
          icon={<InformationIcon />}
          variant='tertiary'
          size='small'
        />
      </div>
    </div>
  );
};
