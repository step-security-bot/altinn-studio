import React from 'react';
import classes from './MigrateModal.module.css';
import { Modal } from '../Modal';
import { Button } from '@digdir/design-system-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Displays the modal for migration from Altinn 2 to Altinn 3
 *
 * @param props.isOpen boolean for if the modal is open or not
 * @param props.onClose function to close the modal
 */
export const MigrateModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Migrer en ressurs fra altinn II'>
      <p className={classes.text}>TODO - Coming soon</p>
      <div className={classes.buttonWrapper}>
        <div className={classes.closeButton}>
          <Button onClick={onClose} color='primary' variant='quiet'>
            Avbryt
          </Button>
        </div>
        <Button onClick={() => {}} color='primary'>
          Planlegg migrering
        </Button>
      </div>
    </Modal>
  );
};
