import React, { ReactNode, useRef, useEffect, ChangeEvent, useState } from 'react';
import classes from './InputPopover.module.css';
import { Button, ErrorMessage, LegacyPopover, Textfield } from '@digdir/design-system-react';
import { useTranslation } from 'react-i18next';
import { getPageNameErrorKey } from '../../../../../utils/designViewUtils';

export type InputPopoverProps = {
  /**
   * The old name of the page
   */
  oldName: string;
  /**
   * The list containing all page names
   */
  layoutOrder: string[];
  /**
   * Saves the new name of the page
   * @param newName the new name to save
   * @returns void
   */
  saveNewName: (newName: string) => void;
  /**
   * Function to be executed when closing the popover
   * @param event optional mouse event
   * @returns void
   */
  onClose: (event?: React.MouseEvent<HTMLButtonElement> | MouseEvent) => void;
  /**
   * If the popover is open or not
   */
  open: boolean;
  /**
   * The component that triggers the opening of the popover
   */
  trigger: ReactNode;
};

/**
 * @component
 *    Displays a popover where the user can edit the name of the page
 *
 * @property {string}[oldName] - The old name of the page
 * @property {string[]}[layoutOrder] - The list containing all page names
 * @property {function}[saveNewName] - Saves the new name of the page
 * @property {function}[onClose] - Function to be executed when closing the popover
 * @property {boolean}[open] - If the popover is open or not
 * @property {ReactNode}[trigger] - The component that triggers the opening of the popover
 *
 * @returns {ReactNode} - The rendered component
 */
export const InputPopover = ({
  oldName,
  layoutOrder,
  saveNewName,
  onClose,
  open = false,
  trigger,
}: InputPopoverProps): ReactNode => {
  const { t } = useTranslation();

  const ref = useRef(null);

  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [newName, setNewName] = useState<string>(oldName);
  const shouldSavingBeEnabled = errorMessage === null && newName !== oldName;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose(event);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, open]);

  /**
   * Handles the change of the new page name. If the name exists, is empty, is too
   * long, or has a wrong format, an error is set, otherwise the value displayed is changed.
   */
  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newNameCandidate = event.target.value;
    const nameError: string = getPageNameErrorKey(newNameCandidate, oldName, layoutOrder);
    setErrorMessage(nameError === null ? null : t(nameError));
    setNewName(newNameCandidate);
  };

  /**
   * If there is no error and the name is changed, and enter is clicked, the new name is saved.
   * When Escape is clicked, the popover closes.
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !errorMessage && oldName !== newName) {
      saveNewName(newName);
      onClose();
    } else if (event.key === 'Escape') {
      onClose();
      setNewName(oldName);
      setErrorMessage(null);
    }
  };

  return (
    <div ref={ref}>
      <LegacyPopover className={classes.popover} trigger={trigger} open={open}>
        <Textfield
          label={t('ux_editor.input_popover_label')}
          size='small'
          onKeyDown={handleKeyPress}
          onChange={handleOnChange}
          value={newName}
          error={errorMessage !== null}
        />
        <ErrorMessage className={classes.errorMessage} size='small'>
          {errorMessage}
        </ErrorMessage>
        <div className={classes.buttonContainer}>
          <Button
            color='first'
            variant='primary'
            onClick={() => saveNewName(newName)}
            disabled={!shouldSavingBeEnabled}
            size='small'
          >
            {t('ux_editor.input_popover_save_button')}
          </Button>
          <Button
            color='second'
            variant='tertiary'
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              onClose(event);
            }}
            size='small'
          >
            {t('general.cancel')}
          </Button>
        </div>
      </LegacyPopover>
    </div>
  );
};
