import { queriesMock, renderHookWithMockStore } from '../../testing/mocks';
import { AddLayoutMutationArgs, useAddLayoutMutation } from './useAddLayoutMutation';
import { useFormLayoutsQuery } from '../queries/useFormLayoutsQuery';
import { waitFor } from '@testing-library/react';
import { useFormLayoutSettingsQuery } from '../queries/useFormLayoutSettingsQuery';

// Test data:
const org = 'org';
const app = 'app';
const layoutName = 'layoutName';
const defaultArgs: AddLayoutMutationArgs = { layoutName }

describe('useAddLayoutMutation', () => {
  afterEach(jest.clearAllMocks);

  it('Calls saveFormLayout with new layout', async () => {
    await renderAndWaitForData();

    const addLayoutResult = renderHookWithMockStore()(() => useAddLayoutMutation(org, app))
      .renderHookResult
      .result;

    addLayoutResult.current.mutate(defaultArgs);

    await waitFor(() => expect(addLayoutResult.current.isSuccess).toBe(true));

    expect(queriesMock.saveFormLayout).toHaveBeenCalledWith(
      org,
      app,
      layoutName,
      {
        $schema: expect.stringContaining(''),
        data: {
          layout: [],
          hidden: false
        }
      }
    );
  });

  // Todo: Add test for adding receipt page
});

const renderAndWaitForData = async () => {
  const formLayoutsResult = renderHookWithMockStore()(() => useFormLayoutsQuery(org, app)).renderHookResult.result;
  const settingsResult = renderHookWithMockStore()(() => useFormLayoutSettingsQuery(org, app)).renderHookResult.result;
  await waitFor(() => expect(formLayoutsResult.current.isSuccess).toBe(true));
  await waitFor(() => expect(settingsResult.current.isSuccess).toBe(true));
}
