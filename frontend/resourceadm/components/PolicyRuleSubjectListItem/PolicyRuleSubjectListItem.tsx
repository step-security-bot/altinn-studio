import React from 'react';
import classes from './PolicyRuleSubjectListItem.module.css';
import { MultiplyIcon } from '@navikt/aksel-icons';

interface Props {
  subjectTitle: string;
  onRemove: () => void;
}

export const PolicyRuleSubjectListItem = ({ subjectTitle, onRemove }: Props) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.titleWrapper}>
        <p className={classes.subjectTitle}>{subjectTitle}</p>
      </div>
      <button className={classes.button} onClick={onRemove} type='button'>
        <MultiplyIcon title='Fjern rettigheter for valgt rolle' color='inherit' fontSize='1.3rem' />
      </button>
    </div>
  );
};
