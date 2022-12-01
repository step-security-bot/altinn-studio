import React from 'react';
import { CheckboxGroup } from '@altinn/altinn-design-system';
import type { FormComponentType, ITextResource } from '../types/global';
import { TextFieldPreview } from './TextFieldPreview';
import { getTextResource } from '../utils/language';

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
  component: FormComponentType;
  label: string;
  textResources: ITextResource[];
}

interface ICheckboxItem {
  checked: boolean;
  label: string;
  name: string;
}

const checkBoxitems: any = [
  { checked: false, label: 'Merkur', name: 'planet1' },
  { checked: false, label: 'Venus', name: 'planet2' },
  { checked: false, label: 'Jorden', name: 'planet3' },
];

export const PreviewComponentWrapper = ({
  label,
  component,
  textResources,
}: IPreviewComponentWrapperProps) => {
  if (component.type == ComponentTypes.Checkboxes) {
    const myOptions: Array<ICheckboxItem> = [];
    component.options.forEach((option) => {
      myOptions.push({
        checked: false,
        label: getTextResource(option.label, textResources),
        name: option.value,
      } as unknown as ICheckboxItem);
    });
    return (
      <CheckboxGroup items={myOptions.length !== 0 ? myOptions : checkBoxitems} legend={label} />
    );
  } else if (component.type == ComponentTypes.Input) {
    return <TextFieldPreview label={label} />;
  } else {
    return <span>{label} To be implemented</span>;
  }
};
