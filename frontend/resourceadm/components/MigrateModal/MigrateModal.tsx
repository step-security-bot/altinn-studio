import React from 'react';
import classes from './MigrateModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MigrateModal = ({ isOpen, onClose }: Props) => {
  return isOpen ? <div className={classes.test} /> : <div />;
};
