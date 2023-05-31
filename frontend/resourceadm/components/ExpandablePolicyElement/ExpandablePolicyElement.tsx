import React, { ReactNode, useState } from 'react';
import classes from './ExpandablePolicyElement.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

interface Props {
  title: string;
  children: ReactNode;
  isCard?: boolean;
}

// TODO - translate
export const ExpandablePolicyElement = ({ title: cardTitle, children, isCard = true }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={isCard ? classes.cardWrapper : classes.elementWrapper}>
      <button className={classes.expandButton} onClick={() => setIsOpen((v) => !v)}>
        <p className={classes.title}>{cardTitle}</p>
        {isOpen ? (
          <ChevronUpIcon title='Close the card' fontSize='1.8rem' />
        ) : (
          <ChevronDownIcon title='Open the card' fontSize='1.8rem' />
        )}
      </button>
      {isOpen && (
        <div className={isCard ? classes.cardBottomWrapper : classes.elementBottomWrapper}>
          {children}
        </div>
      )}
    </div>
  );
};
