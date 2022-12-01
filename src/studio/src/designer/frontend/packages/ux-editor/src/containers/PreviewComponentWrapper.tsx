import React from 'react';
import { CheckboxGroup } from '@altinn/altinn-design-system';

// TODO: import thids from lanugage file in ux-editor
export enum ComponentTypes {
  Header = 'Header',
  Paragraph = 'Paragraph',
  Input = 'Input',
  Image = 'Image',
  Datepicker = 'Datepicker',
  Dropdown = 'Dropdown',
  Checkboxes = 'Checkboxes',
  RadioButtons = 'RadioButtons',
  TextArea = 'TextArea',
  FileUpload = 'FileUpload',
  FileUploadWithTag = 'FileUploadWithTag',
  Button = 'Button',
  AddressComponent = 'AddressComponent',
  Group = 'Group',
  NavigationBar = 'NavigationBar',
  NavigationButtons = 'NavigationButtons',
  AttachmentList = 'AttachmentList',
  ThirdParty = 'ThirdParty',
}

export interface IPreviewComponentWrapperProps {
  type: ComponentTypes;
  legend: string;
  options?: any[];
}

const checkBoxitems: any = [
  { checked: false, label: 'Merkur', name: 'planet1' },
  { checked: false, label: 'Venus', name: 'planet2' },
  { checked: false, label: 'Jorden', name: 'planet3' },
];

export const PreviewComponentWrapper = ({
  legend,
  options,
  type,
}: IPreviewComponentWrapperProps) => {
  if (type == ComponentTypes.Checkboxes) {
    return <CheckboxGroup items={options ? options : checkBoxitems} legend={legend} />;
  } else {
    return <span>To be implemented</span>;
  }
};
