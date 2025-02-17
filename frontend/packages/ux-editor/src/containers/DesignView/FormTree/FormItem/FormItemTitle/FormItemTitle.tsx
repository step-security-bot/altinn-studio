import React, { ReactNode, useCallback } from 'react';
import { Button } from '@digdir/design-system-react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@altinn/icons';
import classes from './FormItemTitle.module.css';
import { FormComponent } from '../../../../../types/FormComponent';
import { FormContainer } from '../../../../../types/FormContainer';
import { useDeleteItem } from './useDeleteItem';

export interface FormItemTitleProps {
  children: ReactNode;
  formItem: FormComponent | FormContainer;
}

export const FormItemTitle = ({ children, formItem }: FormItemTitleProps) => {
  const { t } = useTranslation();
  const deleteItem = useDeleteItem(formItem);

  const handleDelete = useCallback(() => {
    if (confirm(t('ux_editor.component_deletion_text'))) {
      deleteItem(formItem.id);
    }
  }, [formItem.id, deleteItem, t]);

  return (
    <div className={classes.root}>
      <div className={classes.label}>{children}</div>
      <Button
        className={classes.deleteButton}
        color='danger'
        icon={<TrashIcon />}
        onClick={handleDelete}
        size='small'
        title={t('general.delete')}
        variant='tertiary'
      />
    </div>
  );
};
