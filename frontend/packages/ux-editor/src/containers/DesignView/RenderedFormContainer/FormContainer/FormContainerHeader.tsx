import React, { memo, useState } from 'react';
import { ConnectDragSource } from 'react-dnd';
import cn from 'classnames';
import '../../../../styles/index.css';
import { Button } from '@digdir/design-system-react';
import classes from './FormContainerHeader.module.css';
import { ChevronUpIcon, TrashIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { DragHandle } from '../../../../components/FormComponent/DragHandle';
import { useTranslation } from 'react-i18next';
import { AltinnConfirmDialog } from 'app-shared/components';

export interface IFormContainerHeaderProps {
  id: string;
  expanded: boolean;
  isEditMode: boolean;
  handleExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  dragHandleRef: ConnectDragSource;
}

export const FormContainerHeader = memo(function FormContainerHeader({
  id,
  expanded,
  isEditMode,
  handleExpanded,
  handleDelete,
  dragHandleRef,
}: IFormContainerHeaderProps) {
  const { t } = useTranslation();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState<boolean>();

  return (
    <div className={cn(isEditMode && classes.editMode, classes.formGroup)}>
      <div ref={dragHandleRef} className={classes.dragHandle}>
        <DragHandle />
      </div>
      <div className={classes.formGroupBar}>
        <Button
          color='second'
          icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => handleExpanded((previous) => !previous)}
          variant='tertiary'
          size='small'
        />
        {t('ux_editor.component_group_header', { id })}
      </div>
      <div className={classes.formGroupButtons}>
        <AltinnConfirmDialog
          open={isConfirmDeleteDialogOpen}
          confirmText={t('ux_editor.component_deletion_confirm')}
          onConfirm={handleDelete}
          onClose={() => setIsConfirmDeleteDialogOpen(false)}
          trigger={
            <Button
              className={classes.deleteGroupComponent}
              icon={<TrashIcon />}
              title={t('general.delete')}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setIsConfirmDeleteDialogOpen((prevState) => !prevState);
              }}
              variant='tertiary'
              size='small'
            />
          }
        >
          <p>{t('ux_editor.component_deletion_text')}</p>
        </AltinnConfirmDialog>
      </div>
    </div>
  );
});
