import React from 'react';
import { TextField } from '@digdir/design-system-react';
import { FormComponent } from '../../../types/FormComponent';

export interface InputProps {
  component: FormComponent;
  label: string;
  saveValue: (value: string) => void;
  value: string;
}

export const Input = ({ component, label, value, saveValue }: InputProps) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(value ?? '');

  const handleChange = (event: any) => setInternalValue(event.target.value);

  const handleBlur = () => {
    saveValue(internalValue);
  };

  React.useEffect(() => {
    setInternalValue(value ?? '');
  }, [setInternalValue, value]);
  return (
    <TextField
      id={`component-id-input${component.id}`}
      key={`component-id-input${component.id}`}
      label={label}
      onChange={handleChange}
      onBlur={handleBlur}
      value={internalValue}
    />
  );
};
