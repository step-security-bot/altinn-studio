import React from 'react';
import { IGenericEditComponent } from '../../components/config/componentConfig';
import { ComponentTypes } from '../../components';
import { CheckboxGroupPreview } from './CheckboxGroupPreview';
import {
  IFormButtonComponent,
  IFormCheckboxComponent,
  IFormRadioButtonComponent,
} from '../../types/global';
import { RadioGroupPreview } from './RadioGroupPreview';
import { ButtonPreview } from './ButtonPreview';

export interface ComponentPreviewProps extends IGenericEditComponent {}

export const ComponentPreview = ({
  component,
  handleComponentChange,
  layoutName,
}: ComponentPreviewProps) => {
  switch (component.type) {
    case ComponentTypes.Checkboxes:
      return (
        <CheckboxGroupPreview
          component={component as IFormCheckboxComponent}
          handleComponentChange={handleComponentChange}
          layoutName={layoutName}
        />
      );
    case ComponentTypes.RadioButtons:
      return (
        <RadioGroupPreview
          component={component as IFormRadioButtonComponent}
          handleComponentChange={handleComponentChange}
          layoutName={layoutName}
        />
      );
    case ComponentTypes.Button:
    case ComponentTypes.NavigationButtons:
      return <ButtonPreview component={component as IFormButtonComponent} />;
    default:
      return <p>Forhåndsvisning er ikke implementert for denne komponenten.</p>;
  }
};
