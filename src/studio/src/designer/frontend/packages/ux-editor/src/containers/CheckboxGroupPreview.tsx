import React from 'react';
import { CheckboxGroup } from '@altinn/altinn-design-system';

export interface ICheckboxGroupPreviewProps {
  legend: string;
  options?: any[];
}

const checkBoxitems: any = [
  { checked: false, label: 'Merkur', name: 'planet1' },
  { checked: false, label: 'Venus', name: 'planet2' },
  { checked: false, label: 'Jorden', name: 'planet3' },
];

export const CheckboxGroupPreview = ({ legend, options }: ICheckboxGroupPreviewProps) => {
  return <CheckboxGroup items={options ? options : checkBoxitems} legend={legend} />;
};
