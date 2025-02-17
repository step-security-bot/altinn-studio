import { renderWithProviders } from '../../test/testUtils';
import { APP_DEVELOPMENT_BASENAME } from 'app-shared/constants';
import { act, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { TextEditor } from './TextEditor';
import { textMock } from '../../../testing/mocks/i18nMock';
import { ServicesContextProps } from 'app-shared/contexts/ServicesContext';
import userEvent from '@testing-library/user-event';
import * as testids from '../../../testing/testids';

// Test data
const org = 'test-org';
const app = 'test-app';
const testTextResourceKey = 'test-key';
const testTextResourceValue = 'test-value';
const languages = ['nb', 'en'];

const queriesMock: Partial<ServicesContextProps> = {
  getTextResources: jest.fn().mockImplementation(() =>
    Promise.resolve({
      resources: [
        {
          id: testTextResourceKey,
          value: testTextResourceValue,
        },
      ],
    })
  ),
  getTextLanguages: jest.fn().mockImplementation(() => Promise.resolve(languages)),
};

const mockSetSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => {
    return [new URLSearchParams({}), mockSetSearchParams];
  },
}));

describe('TextEditor', () => {
  it('renders the component', async () => {
    await render();

    expect(screen.getByText(testTextResourceKey)).toBeInTheDocument();
    expect(screen.getByText(testTextResourceValue)).toBeInTheDocument();
  });

  it('updates search query when searching text', async () => {
    const user = userEvent.setup();

    await render();

    const search = '1';
    const searchInput = screen.getByTestId('text-editor-search-default');
    await act(() => user.type(searchInput, search));

    expect(mockSetSearchParams).toHaveBeenCalledWith({ search });
  });

  it('adds new text resource when clicking add button', async () => {
    const user = userEvent.setup();

    const upsertTextResources = jest.fn().mockImplementation(() => Promise.resolve());

    await render({ upsertTextResources });

    const addButton = screen.getByRole('button', { name: textMock('text_editor.new_text') });
    await act(() => user.click(addButton));

    expect(upsertTextResources).toBeCalledTimes(2);
  });

  it('updates text resource when editing text', async () => {
    const user = userEvent.setup();

    const upsertTextResources = jest.fn().mockImplementation(() => Promise.resolve());

    await render({ upsertTextResources });

    const textarea = screen.getByRole('textbox', { name: 'nb translation' });
    await act(() => user.clear(textarea));
    await act(() => user.type(textarea, 'test'));
    await act(() => user.tab());

    expect(upsertTextResources).toBeCalledWith(org, app, 'nb', { [testTextResourceKey]: 'test' });
  });

  it('updates text id when editing text id', async () => {
    const user = userEvent.setup();

    const updateTextId = jest.fn().mockImplementation(() => Promise.resolve());

    await render({ updateTextId });

    const editButton = screen.getByRole('button', { name: 'toggle-textkey-edit' });
    await act(() => editButton.click());

    const textarea = screen.getByRole('textbox', { name: 'tekst key edit' });
    await act(() => user.clear(textarea));
    await act(() => user.type(textarea, 'test'));
    await act(() => user.tab());

    expect(updateTextId).toBeCalledWith(org, app, [{ newId: 'test', oldId: testTextResourceKey }]);
  });

  it('deletes text id when clicking delete button', async () => {
    const user = userEvent.setup();

    const updateTextId = jest.fn().mockImplementation(() => Promise.resolve());

    await render({ updateTextId });

    const deleteButton = screen.getByRole('button', { name: textMock('schema_editor.delete') });
    await act(() => deleteButton.click());

    const confirmButton = await screen.findByRole('button', {
      name: textMock('schema_editor.textRow-deletion-confirm'),
    });
    await act(() => user.click(confirmButton));

    expect(updateTextId).toBeCalledWith(org, app, [{ oldId: testTextResourceKey }]);
  });

  it('adds new language when clicking add button', async () => {
    const user = userEvent.setup();

    const addLanguageCode = jest.fn().mockImplementation(() => Promise.resolve());

    await render({ addLanguageCode });

    const addBtn = screen.getByRole('button', {
      name: /legg til/i,
    });
    expect(addBtn).toBeDisabled();
    const select = screen.getByRole('combobox');

    await act(() => user.type(select, 'nordsamisk'));
    await act(() => user.click(screen.getByText('nordsamisk')));

    expect(addBtn).not.toBeDisabled();
    await act(() => user.click(addBtn));

    expect(addLanguageCode).toBeCalledWith(org, app, 'se', {
      language: 'se',
      resources: [{ id: testTextResourceKey, value: '' }],
    });
  });

  it('deletes a language when clicking delete button', async () => {
    const user = userEvent.setup();

    const deleteLanguageCode = jest.fn().mockImplementation(() => Promise.resolve());

    await render({ deleteLanguageCode });

    const deleteButton = screen.getByTestId(testids.deleteButton('en'));
    await act(() => user.click(deleteButton));

    const confirmButton = await screen.findByRole('button', {
      name: textMock('schema_editor.language_confirm_deletion'),
    });
    await act(() => user.click(confirmButton));

    expect(deleteLanguageCode).toBeCalledWith(org, app, 'en');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('renders the spinner', () => {
    renderWithProviders(<TextEditor />, {
      startUrl: `${APP_DEVELOPMENT_BASENAME}/${org}/${app}`,
    });
    expect(screen.getByText(textMock('general.loading'))).toBeInTheDocument();
  });
});

const render = async (queries: Partial<ServicesContextProps> = {}) => {
  const view = renderWithProviders(<TextEditor />, {
    queries: {
      ...queriesMock,
      ...queries,
    },
    startUrl: `${APP_DEVELOPMENT_BASENAME}/${org}/${app}`,
  });

  await waitForElementToBeRemoved(() => screen.queryByText(textMock('general.loading')));

  return view;
};
