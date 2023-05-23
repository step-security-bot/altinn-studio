import { FormComponent } from '../../../types/FormComponent';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentsConfigurations } from '.';
import {
  LegacyAccordion,
  LegacyAccordionHeader,
  LegacyAccordionContent,
} from '@digdir/design-system-react';
import { ComponentType } from '../../index';
import { EditTextResourceBinding } from '../editModal/EditTextResourceBinding';
import { EditDataModelBindings } from '../editModal/EditDataModelBindings';

export interface ComponentConfigurationsProps {
  layoutString: string;
  component: FormComponent;
  handleComponentUpdate?: (updatedComponent: FormComponent) => void;
}

export const ComponentConfigurations = ({
  layoutString,
  handleComponentUpdate,
  component,
}: ComponentConfigurationsProps) => {
  const componentLayout = JSON.parse(layoutString);
  const { t } = useTranslation();
  const layoutData: any[] = componentLayout.data.layout;

  const handleComponentConfigUpdate = (key: string, value: any) => {
    handleComponentUpdate({
      ...component,
      [key]: value,
    });
  };

  return (
    <div>
      {layoutData.map((element: any) => {
        if (element.type === ComponentType.Group) {
          return RenderLayoutGroup(
            element,
            handleComponentConfigUpdate,
            handleComponentUpdate,
            component,
            layoutData
          );
        }
        return (
          !isComponentInGroup(element.id, layoutData) &&
          renderLayoutNode(
            element,
            handleComponentConfigUpdate,
            handleComponentUpdate,
            component,
            component[element.dataModelBindings.simpleBinding],
            t(element.textResourceBindings?.title)
          )
        );
      })}
    </div>
  );
};

const renderLayoutNode = (
  element: FormComponent,
  handleComponentConfigUpdate,
  handleComponentUpdate,
  component,
  value,
  label: string
) => {
  if (element.dataModelBindings?.simpleBinding?.startsWith('textResourceBindings')) {
    const textKey = element.dataModelBindings.simpleBinding.replace('textResourceBindings.', '');
    return (
      <div>
        <EditTextResourceBinding
          key={textKey}
          component={component}
          textKey={textKey}
          labelKey={`ux_editor.modal_properties_${textKey}`}
          handleComponentChange={handleComponentUpdate}
        />
      </div>
    );
  }

  if (element.dataModelBindings.simpleBinding.startsWith('dataModelBindings')) {
    return (
      <EditDataModelBindings
        component={component}
        handleComponentChange={handleComponentUpdate}
        renderOptions={{}}
      />
    );
  }

  if (ComponentsConfigurations[element.type]) {
    const props = {
      component,
      saveValue: (valueToSave: string) =>
        handleComponentConfigUpdate(element.dataModelBindings.simpleBinding, valueToSave),
      value,
      label,
    };
    const RenderComponent = ComponentsConfigurations[element.type].ComponentTag;
    return (
      <RenderComponent
        key={component.id + '-' + element.dataModelBindings.simpleBinding}
        {...props}
      />
    );
  }

  return <p key={element.id}>{element.type}</p>;
};

const isComponentInGroup = (componentId: FormComponent, layoutData: FormComponent[]) => {
  const groupComponents = layoutData.filter((element) => element.type === ComponentType.Group);
  return groupComponents.some((groupComponent) => groupComponent.children.includes(componentId));
};

const RenderLayoutGroup = (
  element: FormComponent,
  handleComponentConfigUpdate,
  handleComponentUpdate,
  component,
  layoutData
) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <LegacyAccordion
      key={element.id}
      onClick={() => setIsOpen(!isOpen)}
      open={isOpen}
      iconVariant='primary'
    >
      <LegacyAccordionHeader>{element.textResourceBindings?.title}</LegacyAccordionHeader>
      <LegacyAccordionContent>
        {element.children.map((childElementId) => {
          const childElement = layoutData.find((el) => el.id === childElementId);
          return renderLayoutNode(
            childElement,
            handleComponentConfigUpdate,
            handleComponentUpdate,
            component,
            component[childElement.dataModelBindings.simpleBinding],
            childElement.textResourceBindings?.title
          );
        })}
      </LegacyAccordionContent>
    </LegacyAccordion>
  );
};
