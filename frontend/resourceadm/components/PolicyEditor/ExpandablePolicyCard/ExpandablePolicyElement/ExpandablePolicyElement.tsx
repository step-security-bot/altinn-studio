import React, { ReactNode, useState } from "react";
import classes from "./ExpandablePolicyElement.module.css";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { DropdownMenu } from "./DropdownMenu";
import { Label } from "@digdir/design-system-react";

interface Props {
  /**
   * The title to display on the element.
   */
  title: string;
  /**
   * The React childrens to display inside it.
   */
  children: ReactNode;
  /**
   * Optional flag for if the component is a card or an element
   */
  isCard?: boolean;
  /**
   * Function to be executed when the element is to be removed
   * @returns void
   */
  handleRemoveElement: () => void;
  /**
   * Function to be executed when the element is duplicated
   * @returns void
   */
  handleDuplicateElement: () => void;
  /**
   * Optional flag for if the component has error
   */
  hasError?: boolean;
}

/**
 * @component
 *    Displays a wrapper component that can be expanded and collapsed. The wrapper
 *    component is wrapped around the content that can be collapsed.
 *
 * @example
 *    <ExpandablePolicyElement
 *      title='Some title'
 *      isCard
 *      handleDuplicateElement={handleDuplicateRule}
 *      handleRemoveElement={handleDeleteRule}
 *      hasError={showErrors && getHasRuleError()}
 *    >
 *      <div>...</div>
 *    </ExpandablePolicyElement>
 *
 * @property {string}[title] - The title to display on the element.
 * @property {ReactNode}[children] - The React childrens to display inside it.
 * @property {boolean}[isCard] - Optional flag for if the component is a card or an element
 * @property {function}[handleRemoveElement] - Function to be executed when the element is to be removed
 * @property {function}[handleDuplicateElement] - Function to be executed when the element is duplicated
 * @property {boolean}[hasError] - Optional flag for if the component has error
 *
 * @returns {React.ReactNode} - The rendered component
 */
export const ExpandablePolicyElement = ({
  title: cardTitle,
  children,
  isCard = true,
  handleRemoveElement,
  handleDuplicateElement,
  hasError = false,
}: Props): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isButtonFocused, setIsButtonFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleClickMoreButton = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getTopWrapperErrorClassName = () => {
    if (isCard && hasError) {
      return `${classes.topWrapperError} ${
        isOpen && classes.topWrapperErrorOpen
      }`;
    }
  };

  return (
    <div
      className={`
        ${classes.wrapper}
        ${isCard ? classes.cardWrapper : classes.elementWrapper}
        ${hasError && isCard && classes.cardError}
        ${hasError && isCard && isButtonHovered && classes.cardErrorHover}
        ${isButtonFocused && classes.buttonFocused}
        ${!hasError && isButtonHovered && classes.buttonHovered}
      `}
    >
      <div
        className={`
        ${classes.topWrapper}
        ${isCard ? classes.topWrapperCard : classes.topWrapperElement}
        ${isOpen && isCard && classes.topWrapperCardOpen}
        ${isOpen && !isCard && classes.topWrapperElementOpen}
        ${getTopWrapperErrorClassName()}`}
      >
        <button
          className={
            isCard ? classes.cardExpandButton : classes.elementExpandButton
          }
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onFocus={() => setIsButtonFocused(true)}
          onBlur={() => setIsButtonFocused(false)}
        >
          <Label size="small">{cardTitle}</Label>
          {isOpen ? (
            <ChevronUpIcon title="Close the card" fontSize="1.8rem" />
          ) : (
            <ChevronDownIcon title="Open the card" fontSize="1.8rem" />
          )}
        </button>
        <DropdownMenu
          isOpen={isDropdownOpen}
          handleClickMoreIcon={handleClickMoreButton}
          handleCloseMenu={() => setIsDropdownOpen(false)}
          handleDuplicate={handleDuplicateElement}
          handleDelete={() => {
            handleRemoveElement();
            setIsDropdownOpen(false);
          }}
          isError={hasError}
        />
      </div>
      {isOpen && (
        <div
          className={
            isCard ? classes.cardBottomWrapper : classes.elementBottomWrapper
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};
