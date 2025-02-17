import React from 'react';
import {
  render as rtlRender,
  screen,
  act,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { ServiceContent, ServiceContentProps } from './ServiceContent';
import { Altinn2LinkService } from 'app-shared/types/Altinn2LinkService';
import { textMock } from '../../../../testing/mocks/i18nMock';
import userEvent from '@testing-library/user-event';
import { ServicesContextProps, ServicesContextProvider } from 'app-shared/contexts/ServicesContext';
import { QueryClient } from '@tanstack/react-query';
import { createQueryClientMock } from 'app-shared/mocks/queryClientMock';
import { queriesMock } from 'app-shared/mocks/queriesMock';

const mockSelectedContext: string = 'selectedContext';
const mockEnv: string = 'env1';

const getAltinn2LinkServices = jest.fn().mockImplementation(() => Promise.resolve({}));

const mockAltinn2LinkService: Altinn2LinkService = {
  externalServiceCode: 'code1',
  externalServiceEditionCode: 'edition1',
  serviceName: 'TestService',
};
const mockAltinn2LinkServices: Altinn2LinkService[] = [mockAltinn2LinkService];
const mockOption: string = `${mockAltinn2LinkService.externalServiceCode}-${mockAltinn2LinkService.externalServiceEditionCode}-${mockAltinn2LinkService.serviceName}`;

const mockOnSelectService = jest.fn();

const defaultProps: ServiceContentProps = {
  selectedContext: mockSelectedContext,
  env: mockEnv,
  selectedService: mockAltinn2LinkService,
  onSelectService: mockOnSelectService,
  resourceIdExists: false,
};

describe('ServiceContent', () => {
  afterEach(jest.clearAllMocks);

  it('initially displays the spinner when loading data', () => {
    render();

    expect(screen.getByTitle(textMock('resourceadm.import_resource_spinner'))).toBeInTheDocument();
  });

  it('fetches getAltinn2LinkServices on mount', () => {
    render();
    expect(getAltinn2LinkServices).toHaveBeenCalledTimes(1);
  });

  it('shows an error message if an error occured on the "getAltinn2LinkServices" query', async () => {
    const errorMessage = 'error-message-test';
    render(
      {},
      {
        getAltinn2LinkServices: () => Promise.reject({ message: errorMessage }),
      },
    );

    await waitForElementToBeRemoved(() =>
      screen.queryByTitle(textMock('resourceadm.import_resource_spinner')),
    );

    expect(screen.getByText(textMock('general.fetch_error_message'))).toBeInTheDocument();
    expect(screen.getByText(textMock('general.error_message_with_colon'))).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty list state correctly', async () => {
    render(
      {},
      {
        getAltinn2LinkServices: () => Promise.resolve([]),
      },
    );

    await waitForElementToBeRemoved(() =>
      screen.queryByTitle(textMock('resourceadm.import_resource_spinner')),
    );

    const emptyListError = screen.getByText(
      textMock('resourceadm.import_resource_empty_list', { env: mockEnv }),
    );
    expect(emptyListError).toBeInTheDocument();
  });

  it('hides the resource name and id field when a service is not selected', async () => {
    await resolveAndWaitForSpinnerToDisappear({ selectedService: undefined });

    const select = screen.getAllByLabelText(
      textMock('resourceadm.dashboard_import_modal_select_service'),
    )[0];
    expect(select).toBeInTheDocument();

    const resourceContent = screen.queryByLabelText(
      textMock('resourceadm.dashboard_resource_name_and_id_resource_name'),
    );
    expect(resourceContent).not.toBeInTheDocument();
  });

  it('handles service selection correctly', async () => {
    const user = userEvent.setup();
    await resolveAndWaitForSpinnerToDisappear();

    const select = screen.getAllByLabelText(
      textMock('resourceadm.dashboard_import_modal_select_service'),
    )[0];
    await act(() => user.click(select));
    await act(() => user.click(screen.getByRole('option', { name: mockOption })));

    expect(mockOnSelectService).toHaveBeenCalledWith(mockAltinn2LinkService);
  });
});

const resolveAndWaitForSpinnerToDisappear = async (props: Partial<ServiceContentProps> = {}) => {
  getAltinn2LinkServices.mockImplementation(() => Promise.resolve(mockAltinn2LinkServices));

  render(props);
  await waitForElementToBeRemoved(() =>
    screen.queryByTitle(textMock('resourceadm.import_resource_spinner')),
  );
};

const render = (
  props: Partial<ServiceContentProps> = {},
  queries: Partial<ServicesContextProps> = {},
  queryClient: QueryClient = createQueryClientMock(),
) => {
  const allQueries: ServicesContextProps = {
    ...queriesMock,
    getAltinn2LinkServices,
    ...queries,
  };

  return rtlRender(
    <ServicesContextProvider {...allQueries} client={queryClient}>
      <ServiceContent {...defaultProps} {...props} />
    </ServicesContextProvider>,
  );
};
