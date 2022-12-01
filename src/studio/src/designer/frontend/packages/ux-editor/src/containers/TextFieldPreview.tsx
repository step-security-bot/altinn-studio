import React from 'react';
import { TextField } from '@altinn/altinn-design-system';

export interface ITextFieldPreviewProps {
  label: string;
}

export const TextFieldPreview = ({ label }: ITextFieldPreviewProps) => {
  return <TextField label={label} />;
};
