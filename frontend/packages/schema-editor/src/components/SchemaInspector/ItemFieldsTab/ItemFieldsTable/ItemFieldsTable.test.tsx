import React from 'react';
import { act, screen, within } from '@testing-library/react';
import { ItemFieldsTable, ItemFieldsTableProps } from './ItemFieldsTable';
import {
  createChildNode,
  FieldType,
  getNameFromPointer,
  ObjectKind,
  UiSchemaNode,
  UiSchemaNodes,
} from '@altinn/schema-model';
import {
  renderWithProviders,
  RenderWithProvidersData,
} from '../../../../../test/renderWithProviders';
import { nodeMockBase } from '../../../../../test/mocks/uiSchemaMock';
import { textMock } from '../../../../../../../testing/mocks/i18nMock';
import userEvent from '@testing-library/user-event';

const selectedItemPointer = 'test';
const rootItem: UiSchemaNode = {
  ...nodeMockBase,
  pointer: '#/test',
  fieldType: FieldType.Object,
  children: [`#/properties/${selectedItemPointer}`],
};
const selectedItem: UiSchemaNode = {
  ...createChildNode(rootItem, selectedItemPointer, false),
  objectKind: ObjectKind.Field,
  fieldType: FieldType.Object,
};
const uiSchema: UiSchemaNodes = [rootItem, selectedItem];
const saveDatamodel = jest.fn();
const mockFieldNodes = uiSchema.map((u, i) => ({ domId: `test-node-${i}`, ...u }));

const defaultProps: ItemFieldsTableProps = {
  fieldNodes: mockFieldNodes,
  readonly: false,
  selectedItem: selectedItem,
};

const renderItemFieldsTab = (
  props: Partial<ItemFieldsTableProps> = {},
  data: Partial<RenderWithProvidersData> = {},
) =>
  renderWithProviders({
    ...data,
    appContextProps: {
      data: uiSchema,
      save: saveDatamodel,
      ...data.appContextProps,
    },
  })(<ItemFieldsTable {...defaultProps} {...props} />);

describe('ItemFieldsTable', () => {
  afterEach(jest.clearAllMocks);

  it('render inputs and delete buttons correctly for all fields', async () => {
    const user = userEvent.setup();
    renderItemFieldsTab();
    const textboxes = screen.getAllByLabelText(textMock('schema_editor.field_name'));
    expect(textboxes).toHaveLength(mockFieldNodes.length);
    textboxes.forEach((textbox, i) => expect(textbox).toHaveValue(getNameInTextField(i)));
    expect(screen.getAllByRole('checkbox')).toHaveLength(mockFieldNodes.length);
    expect(
      screen.getAllByRole('button', {
        name: textMock('schema_editor.delete_field'),
      }),
    ).toHaveLength(mockFieldNodes.length);

    // Added to avoid the "Warning: An update to Select inside a test was not wrapped in act(...)." bug
    await act(() => user.tab());
  });

  it('Updates the text field correctly', async () => {
    const user = userEvent.setup();
    renderItemFieldsTab();

    const [firstTextBox] = screen.getAllByLabelText(textMock('schema_editor.field_name'));
    expect(firstTextBox).toHaveValue(getNameInTextField(0));

    await act(() => user.type(firstTextBox, 'a'));
    await act(() => user.tab());

    const [firstTextBoxAfter] = screen.getAllByLabelText(textMock('schema_editor.field_name'));
    expect(firstTextBoxAfter).toHaveValue(getNameInTextField(0) + 'a');

    expect(saveDatamodel).toBeCalledTimes(1);
  });

  it('Calls "save" when "Enter" key is pressed in Text field', async () => {
    const user = userEvent.setup();
    renderItemFieldsTab();

    const [firstTextBox] = screen.getAllByLabelText(textMock('schema_editor.field_name'));
    expect(firstTextBox).toHaveValue(getNameInTextField(0));

    await act(() => user.type(firstTextBox, 'a'));
    await act(() => user.keyboard('{Enter}'));

    expect(saveDatamodel).toBeCalledTimes(1);
  });

  it('Updates the select correctly', async () => {
    const user = userEvent.setup();
    renderItemFieldsTab();

    const [firstSelect] = screen.getAllByRole('combobox', { name: textMock('schema_editor.type') });
    const objectOption = within(firstSelect).getByRole('option', {
      name: textMock('schema_editor.object'),
    }) as HTMLOptionElement;
    expect(objectOption.selected).toBe(true);

    await act(() => user.selectOptions(firstSelect, textMock('schema_editor.string')));

    expect(saveDatamodel).toBeCalledTimes(1);
  });

  it('Updates the switch correctly', async () => {
    const user = userEvent.setup();
    renderItemFieldsTab();

    const [firstSwitch] = screen.getAllByLabelText(textMock('schema_editor.required'));
    expect(firstSwitch).not.toBeChecked();

    await act(() => user.click(firstSwitch));

    expect(saveDatamodel).toBeCalledTimes(1);
  });

  it('Calls "save" when the delete button is clicked', async () => {
    const user = userEvent.setup();
    renderItemFieldsTab();

    const lastIndex = mockFieldNodes.length - 1;
    const lastDeleteButton = screen.getAllByRole('button', {
      name: textMock('schema_editor.delete_field'),
    })[lastIndex];
    await act(() => user.click(lastDeleteButton));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', {
      name: textMock('schema_editor.datamodel_field_deletion_confirm'),
    });
    await act(() => user.click(confirmButton));
    expect(saveDatamodel).toHaveBeenCalledTimes(1);
  });
});

const getNameInTextField = (pos: number): string => {
  const pointer = mockFieldNodes[pos].pointer;
  return getNameFromPointer({ pointer });
};
