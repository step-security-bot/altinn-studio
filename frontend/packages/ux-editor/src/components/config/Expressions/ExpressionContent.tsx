import React, { useState } from 'react';
import {
  Expression,
  SubExpression,
  expressionInPreviewPropertyTexts,
  expressionPropertyTexts,
  Operator,
} from '../../../types/Expressions';
import { Button, Select, Switch } from '@digdir/design-system-react';
import { CheckmarkIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Trans } from 'react-i18next';
import classes from './ExpressionContent.module.css';
import {
  addProperty,
  addSubExpressionToExpression,
  complexExpressionIsSet,
  convertInternalExpressionToExternal,
  isStudioFriendlyExpression,
  tryParseExpression,
  updateComplexExpression,
  updateExpression,
  updateOperator,
} from '../../../utils/expressionsUtils';
import { useText } from '../../../hooks';
import { ComplexExpression } from './ComplexExpression';
import { SimpleExpression } from './SimpleExpression';
import { SimpleExpressionPreview } from './SimpleExpressionPreview';
import { stringifyData } from '../../../utils/jsonUtils';

export interface ExpressionContentProps {
  componentName: string;
  expression: Expression;
  onGetProperties: (expression: Expression) => {
    availableProperties: string[];
    expressionProperties: string[];
  };
  showRemoveExpressionButton: boolean;
  onSaveExpression: (expression: Expression) => void;
  successfullyAddedExpression: boolean;
  expressionInEditMode: boolean;
  onUpdateExpression: (newExpression: Expression) => void;
  onRemoveExpression: (expression: Expression) => void;
  onRemoveSubExpression: (subExpression: SubExpression) => void;
  onEditExpression: (expression: Expression) => void;
}

export const ExpressionContent = ({
  componentName,
  expression,
  onGetProperties,
  showRemoveExpressionButton,
  onSaveExpression,
  successfullyAddedExpression,
  expressionInEditMode,
  onUpdateExpression,
  onRemoveExpression,
  onRemoveSubExpression,
  onEditExpression,
}: ExpressionContentProps) => {
  const [freeStyleEditing, setFreeStyleEditing] = useState<boolean>(!!expression.complexExpression);
  const t = useText();

  const allowToSpecifyExpression = Object.values(
    onGetProperties(expression).expressionProperties,
  ).includes(expression.property);
  const allowToSaveExpression =
    (expression.subExpressions?.filter((subExp) => !subExp.function)?.length === 0 &&
      expression.subExpressions.length !== 0 &&
      expressionInEditMode &&
      !!expression.property) ||
    (complexExpressionIsSet(expression.complexExpression) &&
      expressionInEditMode &&
      !!expression.property);
  const propertiesList = onGetProperties(expression).availableProperties;
  const externalExpression = convertInternalExpressionToExternal(expression);
  const isStudioFriendly = isStudioFriendlyExpression(
    tryParseExpression(expression, externalExpression).complexExpression,
  );

  const addPropertyToExpression = (property: string) => {
    const newExpression: Expression = addProperty(expression, property);
    onUpdateExpression(newExpression);
  };

  const addSubExpression = (expressionOperator: Operator) => {
    const newExpression: Expression = addSubExpressionToExpression(expression, expressionOperator);
    onUpdateExpression(newExpression);
  };

  const updateExpressionOperator = (expressionOperator: Operator) => {
    const newExpression: Expression = updateOperator(expression, expressionOperator);
    onUpdateExpression(newExpression);
  };

  const updateSubExpression = (index: number, subExpression: SubExpression) => {
    const newExpression: Expression = updateExpression(expression, index, subExpression);
    onUpdateExpression(newExpression);
  };

  const updateExpressionComplexExpression = (newComplexExpression: any) => {
    const newExpression: Expression = updateComplexExpression(expression, newComplexExpression);
    onUpdateExpression(newExpression);
  };

  const handleToggleFreeStyleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreeStyleEditing(event.target.checked);
    if (event.target.checked) {
      const stringRepresentationOfExpression = stringifyData(externalExpression);
      updateExpressionComplexExpression(stringRepresentationOfExpression);
    } else {
      updateExpressionComplexExpression(undefined);
    }
  };

  return (
    <>
      {expressionInEditMode ? (
        <div className={classes.editMode}>
          <Switch
            name={'Expression_enable_free_style_editing'}
            onChange={handleToggleFreeStyleEditing}
            checked={freeStyleEditing}
            size={'small'}
            readOnly={!isStudioFriendly}
          >
            {t('right_menu.expression_enable_free_style_editing')}
          </Switch>
          <div className={classes.topBar}>
            <p>
              <Trans
                i18nKey={'right_menu.expressions_property_on_component'}
                values={{ componentName: componentName }}
                components={{ bold: <strong /> }}
              />
            </p>
            {showRemoveExpressionButton && (
              <Button
                aria-label={t('right_menu.expression_delete')}
                color='danger'
                icon={<TrashIcon />}
                onClick={() => onRemoveExpression(expression)}
                variant='tertiary'
                size='small'
              />
            )}
          </div>
          <Select
            label={t('right_menu.expressions_property')}
            hideLabel={true}
            onChange={addPropertyToExpression}
            options={[
              { label: t('right_menu.expressions_property_select'), value: 'default' },
            ].concat(
              propertiesList.map((property: string) => ({
                label: expressionPropertyTexts(t)[property],
                value: property,
              })),
            )}
            value={expression.property || 'default'}
          />
          {complexExpressionIsSet(expression.complexExpression) ? (
            <ComplexExpression
              expression={expression}
              onChange={updateExpressionComplexExpression}
              isStudioFriendly={isStudioFriendly}
            />
          ) : (
            <SimpleExpression
              allowToSpecifyExpression={allowToSpecifyExpression}
              expression={expression}
              onAddSubExpression={(expressionOp: Operator) => addSubExpression(expressionOp)}
              onUpdateSubExpression={(index: number, subExpression: SubExpression) =>
                updateSubExpression(index, subExpression)
              }
              onUpdateExpressionOperator={(expressionOp: Operator) =>
                updateExpressionOperator(expressionOp)
              }
              onRemoveSubExpression={(subExp: SubExpression) => onRemoveSubExpression(subExp)}
            />
          )}
          {allowToSaveExpression && (
            <Button
              color='success'
              icon={<CheckmarkIcon />}
              onClick={() => onSaveExpression(expression)}
              variant='primary'
              size='small'
            >
              {t('general.save')}
            </Button>
          )}
        </div>
      ) : (
        <div className={classes.previewMode}>
          <div className={classes.expressionDetails}>
            <span>
              <Trans
                i18nKey={expressionInPreviewPropertyTexts(t)[expression.property]}
                values={{ componentName: componentName }}
                components={{ bold: <strong /> }}
              />
            </span>
            {complexExpressionIsSet(expression.complexExpression) ? (
              <ComplexExpression expression={expression} disabled />
            ) : (
              <SimpleExpressionPreview expression={expression} />
            )}
            {successfullyAddedExpression && (
              <div className={classes.checkMark}>
                <CheckmarkIcon fontSize='1.5rem' />
                {t('right_menu.expression_successfully_added_text')}
              </div>
            )}
          </div>
          <div>
            <Button
              title={t('right_menu.expression_delete')}
              color='danger'
              icon={<TrashIcon />}
              onClick={() => onRemoveExpression(expression)}
              variant='tertiary'
              size='small'
            />
            <Button
              title={t('right_menu.expression_edit')}
              icon={<PencilIcon />}
              onClick={() => onEditExpression(expression)}
              variant='tertiary'
              size='small'
            />
          </div>
        </div>
      )}
    </>
  );
};
