import React, { useId } from 'react';
import { ErrorMessage, TextField } from '@digdir/design-system-react';
import classes from './TextFieldWithValidation.module.css';
import { Validation } from '../../utils/validationUtils';
import { useValidation } from '../../hooks';

export interface TextFieldWithValidationProps {
  label: string;
  value: string;
  name: string;
  validation: Validation;
  inputMode?: 'search' | 'text' | 'none' | 'tel' | 'numeric' | 'url' | 'email' | 'decimal';
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>, error: string) => void;
}
export const TextFieldWithValidation = ({
  label,
  value,
  name,
  validation,
  inputMode = 'text',
  onChange,
  onBlur,
}: TextFieldWithValidationProps): JSX.Element => {
  const { validationError, validate } = useValidation(name, validation);
  const errorMessageId = useId();

  const validateOnBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    if (!event.target.value) {
      validate(event.target.value);
    }
    if (onBlur) onBlur(event, validationError);
  };

  const handleOnTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    validate(event.target.value);
    onChange(event);
  };

  const textFieldLabel = `${label} ${validation?.required ? '*' : ''}`;
  const isRequired = !!validation?.required;

  return (
    <>
      <TextField
        value={value}
        name={name}
        inputMode={inputMode}
        label={textFieldLabel}
        onBlur={validateOnBlur}
        onChange={handleOnTextFieldChange}
        aria-errormessage={errorMessageId}
        aria-invalid={!!validationError}
        aria-required={isRequired}
        required={isRequired}
      />
      {validationError && (
        <ErrorMessage id={errorMessageId}>
          <p className={classes.errorMessageText}>{validationError}</p>
        </ErrorMessage>
      )}
    </>
  );
};
