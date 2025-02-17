import React from 'react';
import classes from './ResourceNameAndId.module.css';
import { Button, Textfield, ErrorMessage, Paragraph, Label } from '@digdir/design-system-react';
import { MultiplyIcon, PencilWritingIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';

export type ResourceNameAndIdProps = {
  isEditOpen: boolean;
  title: string;
  text: string;
  id: string;
  handleEditTitle: (s: string) => void;
  handleIdInput: (s: string) => void;
  handleClickEditButton: (saveChanges: boolean) => void;
  resourceIdExists: boolean;
  bothFieldsHaveSameValue: boolean;
  className?: string;
};

/**
 * @component
 *    Displays the title and Id of a new resource that is either being
 *    created new, or migrated from Altinn 2.
 *
 * @property {boolean}[isEditOpen] - Flag to decide if the edit ID is open or not
 * @property {string}[title] - The value of the title
 * @property {string}[text] - The text to display above the fields
 * @property {string}[id] - The value of the id
 * @property {function}[handleEditTitle] - Function to handle the editing of the title
 * @property {function}[handleIdInput] - Function to handle the editing of the id
 * @property {function}[handleClickEditButton] - Function to be executed when edit button is clicked
 * @property {boolean}[resourceIdExists] - Flag for id the ID already exists
 * @property {boolean}[bothFieldsHaveSameValue] - Flag for if ID and title has same display value
 * @property {string}[className] - Additional classes
 *
 * @returns {React.ReactNode} - If there should be space on top of the component
 */
export const ResourceNameAndId = ({
  isEditOpen,
  title,
  text,
  id,
  handleEditTitle,
  handleIdInput,
  handleClickEditButton,
  resourceIdExists,
  bothFieldsHaveSameValue,
  className,
}: ResourceNameAndIdProps): React.ReactNode => {
  const { t } = useTranslation();

  /**
   * Replaces spaces and '.' with '-' so that the ID looks correct
   *
   * @param s the string to format
   *
   * @returns the string formatted
   */
  const formatString = (s: string): string => {
    return s.replace(/[\s.]+/g, '-');
  };

  /**
   * If the edit field is open, then the id to dispay is the actual id
   * value, otherwise it is the title value
   *
   * @returns the formatted value
   */
  const getIdToDisplay = (): string => {
    if (isEditOpen) {
      return formatString(id);
    } else if (!bothFieldsHaveSameValue) {
      return formatString(id);
    } else {
      return formatString(title);
    }
  };

  /**
   * Displays either the id input field or the id text
   * @returns ReactNode
   */
  const displayIdTextOrInput = () => {
    if (isEditOpen) {
      return (
        <>
          <Label className={classes.label} size='small' htmlFor='resourceIdInputId'>
            {t('resourceadm.dashboard_resource_name_and_id_resource_id')}
          </Label>
          <div className={classes.editFieldWrapper}>
            <div className={classes.textfieldWrapper}>
              <Textfield
                value={id}
                size='small'
                onChange={(e) => handleIdInput(e.target.value)}
                id='resourceIdInputId'
                error={resourceIdExists}
              />
            </div>
            <div className={classes.buttonWrapper}>
              <div className={classes.stopEditingButton}>
                <Button
                  onClick={() => handleClickEditButton(false)}
                  variant='tertiary'
                  color='danger'
                  icon={
                    <MultiplyIcon
                      title={t('resourceadm.dashboard_resource_name_and_id_delete_icon')}
                    />
                  }
                  size='small'
                />
              </div>
              <Button
                onClick={() => handleClickEditButton(true)}
                variant='tertiary'
                icon={
                  <CheckmarkIcon
                    title={t('resourceadm.dashboard_resource_name_and_id_checkmark_icon')}
                  />
                }
                size='small'
              />
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <Paragraph className={classes.label} size='small'>
          <strong>{t('resourceadm.dashboard_resource_name_and_id_resource_id')}</strong>
        </Paragraph>
        <div className={classes.editFieldWrapper}>
          <div className={classes.idBox}>
            <p className={classes.idText}>id</p>
          </div>
          <Paragraph size='small'>
            {/* TODO - find out what to replace altinn.svv with if it has to be replaced? */}
            <strong>{getIdToDisplay()}</strong>
          </Paragraph>
          <div className={classes.editButtonWrapper}>
            <Button
              onClick={() => handleClickEditButton(false)}
              iconPlacement='right'
              icon={<PencilWritingIcon />}
              variant='tertiary'
              color='first'
              size='small'
            >
              {t('general.edit')}
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={className}>
      <Paragraph size='small'>{text}</Paragraph>
      <Label className={classes.label} size='small' htmlFor='resourceNameInputId'>
        {t('resourceadm.dashboard_resource_name_and_id_resource_name')}
      </Label>
      <div className={classes.textfieldWrapper}>
        <Textfield
          value={title}
          onChange={(e) => handleEditTitle(e.target.value)}
          id='resourceNameInputId'
          size='small'
        />
      </div>
      {displayIdTextOrInput()}
      <div className={classes.resourceIdError}>
        {resourceIdExists && (
          <ErrorMessage size='small'>
            {t('resourceadm.dashboard_resource_name_and_id_error')}
          </ErrorMessage>
        )}
      </div>
    </div>
  );
};
