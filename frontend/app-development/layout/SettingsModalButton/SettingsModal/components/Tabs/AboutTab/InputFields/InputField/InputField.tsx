import React, { ReactNode } from 'react';
import classes from './InputField.module.css';
import { ErrorMessage, Textfield } from '@digdir/design-system-react';

export type InputFieldProps = {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  isValid?: boolean;
  errorText?: string;
  readOnly?: boolean;
};

/**
 * @component
 *    Displays a textfield for input fields in the Settings modal.
 *
 * @example
 *    <InputField
 *      id='someId'
 *      label='Label of the field'
 *      description='The description of the field'
 *      value={value}
 *      onChange={(value: string) => setValue(value)}
 *      onBlur={handleBlur}
 *      isValid={isValudValid}
 *      errorText='The field is invalid.'
 *    />
 *
 * @property {string}[id] - The id of the field
 * @property {string}[label] - The label of the text field
 * @property {string}[description] - The description of the text field
 * @property {string}[value] - The value in the field
 * @property {function}[onChange] - Function that updates the value in the field
 * @property {function}[onBlur] -  Function to be executed on blur
 * @property {boolean}[isValid] - Flag for if the value in the field is valid
 * @property {string}[errorText] - Error text to show if field is invalid
 * @property {boolean}[readOnly] - Flag for if the field is read only
 *
 * @returns {ReactNode} - The rendered component
 */
export const InputField = ({
  id,
  label,
  description,
  value,
  onChange,
  onBlur,
  isValid = true,
  errorText,
  readOnly,
}: InputFieldProps): ReactNode => {
  return (
    <div className={classes.wrapper}>
      <Textfield
        label={label}
        description={description}
        size='small'
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={!isValid}
        readOnly={readOnly}
      />
      {!isValid && <ErrorMessage size='small'>{errorText}</ErrorMessage>}
    </div>
  );
};
