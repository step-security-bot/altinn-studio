import React from 'react';
import type { EditSettings, IGenericEditComponent } from './componentConfig';
import { ComponentType } from '../index';
import { EditComponentId } from './editModal/EditComponentId';
import { componentSpecificEditConfig, configComponents } from './componentConfig';
import { ComponentSpecificContent } from './componentSpecificContent';
import { FieldSet } from '@digdir/design-system-react';
import classes from './EditModalContent.module.css';
import type { FormComponent } from '../../types/FormComponent';
import { useFormLayoutsSelector } from '../../hooks/useFormLayoutsSelector';
import { selectedLayoutNameSelector } from '../../selectors/formLayoutSelectors';
import { useComponentErrorMessage } from '../../hooks/useComponentErrorMessage';
import { ComponentConfigurations } from './ComponentConfigurations/ComponentConfigurations';

export interface IEditModalContentProps {
  cancelEdit?: () => void;
  component: FormComponent;
  handleComponentUpdate?: (updatedComponent: FormComponent) => void;
  saveEdit?: (updatedComponent: FormComponent) => void;
  thirdPartyComponentConfig?: EditSettings[];
}

export const EditModalContent = ({
  component,
  handleComponentUpdate,
  thirdPartyComponentConfig,
}: IEditModalContentProps) => {
  const selectedLayout = useFormLayoutsSelector(selectedLayoutNameSelector);
  const errorMessage = useComponentErrorMessage(component);
  const renderFromComponentSpecificDefinition = (configDef: EditSettings[]) => {
    if (component.type === ComponentType.Input) {
      return (
        <ComponentConfigurations
          component={component}
          layoutString={componentLayoutString}
          handleComponentUpdate={handleComponentUpdate}
        />
      );
    }
    if (!configDef) return null;

    return configDef.map((configType) => {
      const Tag = configComponents[configType];
      if (!Tag) return null;
      return React.createElement<IGenericEditComponent>(Tag, {
        key: configType,
        handleComponentChange: handleComponentUpdate,
        component,
      });
    });
  };

  const getConfigDefinitionForComponent = (): EditSettings[] => {
    if (component.type === ComponentType.ThirdParty) {
      return thirdPartyComponentConfig[component.tagName];
    }

    return componentSpecificEditConfig[component.type];
  };

  return (
    <FieldSet className={classes.root} error={errorMessage}>
      <EditComponentId component={component} handleComponentUpdate={handleComponentUpdate} />
      {renderFromComponentSpecificDefinition(getConfigDefinitionForComponent())}
      <ComponentSpecificContent
        component={component}
        handleComponentChange={handleComponentUpdate}
        layoutName={selectedLayout}
      />
    </FieldSet>
  );
};

const componentLayoutString = `
{
  "$schema": "https://altinncdn.no/schemas/json/layout/layout.schema.v1.json",
  "data": {
      "layout": [
          {
              "id": "ID",
              "type": "Input",
              "textResourceBindings": {
                  "title": "Komponent-ID",
                  "description": "Side1.ID.description"
              },
              "dataModelBindings": {
                  "simpleBinding": "id"
              },
              "required": true,
              "readOnly": false
          },
          {
              "id": "textResourceBindings",
              "type": "Group",
              "textResourceBindings": {
                "title": "Tekster"
            },
              "children": [
                  "title",
                  "description"
              ],
              "maxCount": 0,
              "dataModelBindings": {}
          },
          {
              "id": "title",
              "type": "Input",
              "textResourceBindings": {
                  "title": "Ledetekst"
              },
              "dataModelBindings": {
                  "simpleBinding": "textResourceBindings.title"
              },
              "required": false,
              "readOnly": false
          },
          {
              "id": "description",
              "type": "Input",
              "textResourceBindings": {
                  "title": "Beskrivelse"
              },
              "dataModelBindings": {
                  "simpleBinding": "textResourceBindings.description"
              },
              "required": false,
              "readOnly": false
          },
          {
              "id": "grid",
              "type": "Group",
              "textResourceBindings": {
                "title": "Grid"
            },
              "children": [
                  "grid-xs",
                  "grid-s",
                  "grid-m",
                  "grid-l"
              ],
              "maxCount": 0,
              "dataModelBindings": {}
          },
          {
              "id": "grid-xs",
              "type": "Input",
              "textResourceBindings": {
                  "title": "XS"
              },
              "dataModelBindings": {
                  "simpleBinding": "Extra small"
              },
              "required": false,
              "readOnly": false
          },
          {
              "id": "grid-s",
              "type": "Input",
              "textResourceBindings": {
                  "title": "Small"
              },
              "dataModelBindings": {
                  "simpleBinding": "grid.s"
              },
              "required": false,
              "readOnly": false
          },
          {
              "id": "grid-m",
              "type": "Input",
              "textResourceBindings": {
                  "title": "Medium"
              },
              "dataModelBindings": {
                  "simpleBinding": "grid.m"
              },
              "required": false,
              "readOnly": false
          },
          {
              "id": "grid-l",
              "type": "Input",
              "textResourceBindings": {
                  "title": "Large"
              },
              "dataModelBindings": {
                  "simpleBinding": "grid.l"
              },
              "required": false,
              "readOnly": false
          },
          {
              "id": "dataModelBindings",
              "type": "Group",
              "textResourceBindings": {
                "title": "Datamodell"
            },
              "children": [
                  "simpleBinding"
              ],
              "maxCount": 0,
              "dataModelBindings": {}
          },
          {
              "id": "simpleBinding",
              "type": "Dropdown",
              "textResourceBindings": {
                  "title": "Input.simpleBinding.title"
              },
              "dataModelBindings": {
                  "simpleBinding": "dataModelBindings.simpleBinding"
              },
              "required": false,
              "optionsId": "datamodel"
          }
      ]
  }
}`;
