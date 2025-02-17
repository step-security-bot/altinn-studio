import React from 'react';
import { screen } from '@testing-library/react';
import { internalExpressionWithMultipleSubExpressions } from '../../../testing/expressionMocks';
import { ServicesContextProps } from 'app-shared/contexts/ServicesContext';
import { renderWithMockStore } from '../../../testing/mocks';
import { SimpleExpressionPreview, SimpleExpressionPreviewProps } from './SimpleExpressionPreview';
import { textMock } from '../../../../../../testing/mocks/i18nMock';

describe('SimpleExpressionPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays all values for a subexpression as strings and operator', () => {
    render({});

    const nullText = screen.getByText(textMock('right_menu.expressions_data_source_null'));
    expect(nullText).toBeInTheDocument();
    const numberText = screen.getByText(textMock('right_menu.expressions_data_source_number'));
    expect(numberText).toBeInTheDocument();
    const numberValueText = screen.getByText(internalExpressionWithMultipleSubExpressions.subExpressions[0].comparableValue as string);
    expect(numberValueText).toBeInTheDocument();
    const booleanText = screen.getByText(textMock('right_menu.expressions_data_source_boolean'));
    expect(booleanText).toBeInTheDocument();
    const booleanValueText = screen.getByText(textMock('general.true'));
    expect(booleanValueText).toBeInTheDocument();
    const componentText = screen.getByText(textMock('right_menu.expressions_data_source_component'));
    expect(componentText).toBeInTheDocument();
    const componentValueText = screen.getByText(internalExpressionWithMultipleSubExpressions.subExpressions[1].comparableValue as string);
    expect(componentValueText).toBeInTheDocument();
    const operatorText = screen.getByText(textMock('right_menu.expressions_operator_or'));
    expect(operatorText).toBeInTheDocument();

  });
});

const render = ({ props = {}, queries = {}, }: {
  props?: Partial<SimpleExpressionPreviewProps>;
  queries?: Partial<ServicesContextProps>;
}) => {
  const defaultProps: SimpleExpressionPreviewProps = {
    expression: internalExpressionWithMultipleSubExpressions
  };
  return renderWithMockStore({}, queries)(<SimpleExpressionPreview {...defaultProps} {...props} />);
};
