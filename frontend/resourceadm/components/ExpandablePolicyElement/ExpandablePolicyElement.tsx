import React, { ReactNode, useState } from 'react';
import classes from './ExpandablePolicyElement.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  title: string;
  children: ReactNode;
  isCard?: boolean;
}

/**
 * Displays a wrapper component that can be expanded and collapsed. The wrapper
 * component is wrapped around the content that can be collapsed.
 *
 * @param props.title the title to display on the element.
 * @param props.children the React childrens to display inside it.
 * @param props.isCard optional for if the component is a card or an element
 */
export const ExpandablePolicyElement = ({ title: cardTitle, children, isCard = true }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClickMoreButton = () => {
    setIsDropdownOpen((prev) => !prev);
    console.log('hei');
  };

  const handleDelete = () => {
    // TODO: Handle delete action
  };

  const handleDuplicate = () => {
    // TODO: Handle duplicate action
  };

  return (
    <div className={isCard ? classes.cardWrapper : classes.elementWrapper}>
      <div className={classes.topWrapper}>
        <button
          className={isCard ? classes.cardExpandButton : classes.elementExpandButton}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p className={classes.title}>{cardTitle}</p>
          {isOpen ? (
            <ChevronUpIcon title='Close the card' fontSize='1.8rem' />
          ) : (
            <ChevronDownIcon title='Open the card' fontSize='1.8rem' />
          )}
        </button>
        <DropdownMenu
          isOpen={isDropdownOpen}
          handleClickMoreIcon={handleClickMoreButton}
          handleCloseMenu={() => setIsDropdownOpen(false)}
          handleDuplicate={handleDuplicate}
          handleDelete={handleDelete}
        />
      </div>
      {isOpen && (
        <div className={isCard ? classes.cardBottomWrapper : classes.elementBottomWrapper}>
          {children}
        </div>
      )}
    </div>
  );
};
