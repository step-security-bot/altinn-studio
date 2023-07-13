import React, { useCallback, useEffect, useState } from 'react';
import { ErrorMessage } from '@digdir/design-system-react';
import classes from './FormField.module.css';
import { useText } from '../../hooks';
import { validateProperty, isPropertyRequired } from '../../utils/formValidationUtils';
import { TranslationKey } from 'language/type';
import { useLayoutSchemaQuery } from '../../hooks/queries/useLayoutSchemaQuery';

export type FormFieldChildProps<TT> = {
  errorCode: string;
  value: any;
  label: string;
  onChange: (value: TT, event?: React.ChangeEvent<HTMLInputElement>) => void;
  customRequired: boolean;
}

export interface FormFieldProps<T, TT> {
  id?: string;
  className?: string;
  label?: string;
  value: T;
  children: (props: FormFieldChildProps<TT>) => React.ReactNode;
  onChange?: (value: TT, event: React.ChangeEvent<HTMLInputElement>, errorCode: string) => void;
  propertyPath?: string;
  customRequired?: boolean;
  customValidationRules?: (value: T | TT) => string;
  customValidationMessages?: (errorCode: string) => string;
}

export const FormField = <T extends unknown, TT extends unknown>({
  id,
  className,
  label,
  value,
  children,
  onChange,
  propertyPath,
  customRequired = false,
  customValidationRules,
  customValidationMessages,
}: FormFieldProps<T, TT>): JSX.Element => {
  const t = useText();

  const [{ data: layoutSchema }] = useLayoutSchemaQuery();

  const [propertyId, setPropertyId] = useState(layoutSchema && propertyPath ? `${layoutSchema.$id}#/${propertyPath}`: null);
  const [isRequired, setIsRequired] = useState(customRequired || isPropertyRequired(layoutSchema, propertyPath));

  const validate = useCallback((newValue: T | TT) => {
    if (newValue === undefined || newValue === null || newValue === '') {
      return isRequired ? 'required' : null;
    }

    if (customValidationRules) {
      const customValidation = customValidationRules(newValue);
      if (customValidation) return customValidation;
    }

    if (propertyId) return validateProperty(propertyId, newValue);

    return null;
  }, [customValidationRules, isRequired, propertyId]);

  const [tmpValue, setTmpValue] = useState<T | TT>(value);
  const [errorCode, setErrorCode] = useState(layoutSchema ? validate(value) : null);

  useEffect(() => {
    setTmpValue(value);
  }, [value, id]);

  useEffect(() => {
    if (layoutSchema) setErrorCode(validate(value));
  }, [value, id, layoutSchema, validate]);

  useEffect(() => {
    if (layoutSchema) setPropertyId(propertyPath ? `${layoutSchema.$id}#/${propertyPath}`: null);
  }, [layoutSchema, propertyPath]);

  useEffect(() => {
    if (layoutSchema) setIsRequired(customRequired || isPropertyRequired(layoutSchema, propertyPath));
  }, [customRequired, layoutSchema, propertyPath]);

  const handleOnChange = (newValue: TT, event?: React.ChangeEvent<HTMLInputElement>): void => {
    const errCode = validate(newValue);
    setErrorCode(errCode);
    if (!errCode) onChange(newValue, event, errorCode);
    setTmpValue(newValue);
  };

  const renderChildren = (childList: React.ReactNode) => {
    let fieldLabel: string;
    if (label) fieldLabel = `${label}${isRequired ? ' *' : ''}`;

    return React.Children.map(childList, (child) => {
      if (React.isValidElement(child)) {
        const props = typeof child.type !== 'string' ? {
          value: tmpValue,
          required: isRequired,
          label: fieldLabel,
          onChange: handleOnChange,
          isValid: !errorCode,
          ...child.props,
        } : {};

        return React.cloneElement(child, props);
      }
    });
  };

  const showErrorMessages = () => {
    if (customValidationMessages) {
      const validationMessage = customValidationMessages(errorCode);
      if (validationMessage) return validationMessage;
    }

    const key = `validation_errors.${errorCode}` as TranslationKey;
    const str = t(key);
    if (str !== key) return str;

    return t('validation_errors.pattern');
  };

  return (
    <div className={className}>
      {renderChildren(children({
        errorCode,
        value: tmpValue,
        label,
        onChange: handleOnChange,
        customRequired: isRequired
      }))}
      {errorCode && (
        <ErrorMessage className={classes.errorMessageText} size="small">
          {showErrorMessages()}
        </ErrorMessage>
      )}
    </div>
  );
};
