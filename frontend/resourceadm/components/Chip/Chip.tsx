import React from 'react';
import classes from './Chip.module.css';

interface Props {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}
export const Chip = ({ text, isSelected, onClick }: Props) => {
  return (
    <button
      className={isSelected ? classes.chipSelected : classes.chip}
      type='button'
      onClick={onClick}
    >
      <p className={classes.text}>{text}</p>
    </button>
  );
};
