import React from 'react';
import { FieldType, ObjectKind, UiSchemaNode } from '@altinn/schema-model';
import { screen } from '@testing-library/react';
import { TypeItem } from './TypeItem';
import { renderWithProviders } from '../../../test/renderWithProviders';
describe('TypeItem', () => {
  const uiSchemaNode: UiSchemaNode = {
    children: [],
    custom: null,
    fieldType: FieldType.Object,
    implicitType: false,
    isArray: false,
    isCombinationItem: false,
    isNillable: false,
    isRequired: false,
    objectKind: ObjectKind.Field,
    pointer: '#/$defs/MyTestType',
    restrictions: null,
  };
  it('should render the component', () => {
    renderWithProviders()(
      <TypeItem setSelectedTypePointer={jest.fn()} uiSchemaNode={uiSchemaNode} />
    );
    expect(screen.getByText('MyTestType')).toBeInTheDocument();
  });
});
