import React, { ReactNode, useState } from 'react';
import classes from './ExpandableCard.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

interface Props {
  cardTitle: string;
  children: ReactNode;
}

export const ExpandableCard = ({ cardTitle, children }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={classes.wrapper}>
      <button className={classes.expandButton} onClick={() => setIsOpen((v) => !v)}>
        <p className={classes.title}>{cardTitle}</p>
        {isOpen ? (
          <ChevronUpIcon title='a11y-title' fontSize='1.8rem' />
        ) : (
          <ChevronDownIcon title='a11y-title' fontSize='1.8rem' />
        )}
      </button>
      {isOpen && <div className={classes.bottomWrapper}>{children}</div>}
    </div>
  );
};
