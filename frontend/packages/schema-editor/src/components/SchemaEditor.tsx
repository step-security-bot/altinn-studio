import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import classes from './SchemaEditor.module.css';
import { setSchemaName, setSelectedId, setUiSchema } from '../features/editor/schemaEditorSlice';
import { useTranslation } from 'react-i18next';
import { TypesInspector } from '@altinn/schema-editor/components/TypesInspector';
import classNames from 'classnames';
import { Button } from '@digdir/design-system-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { ModelsPanel, TypesPanel } from '@altinn/schema-editor/components/layout';
import { SchemaInspector } from '@altinn/schema-editor/components/SchemaInspector';
import {
  UiSchemaNodes,
  getNameFromPointer,
  isEmpty,
  pointerIsDefinition,
} from '@altinn/schema-model';
import { useSchemaAndReduxSelector } from '@altinn/schema-editor/hooks/useSchemaAndReduxSelector';
import {
  selectedDefinitionParentSelector,
  selectedPropertyParentSelector,
} from '@altinn/schema-editor/selectors/schemaAndReduxSelectors';
import {
  rootChildrenSelector,
  rootNodesSelector,
} from '@altinn/schema-editor/selectors/schemaSelectors';
import { useSchemaEditorAppContext } from '@altinn/schema-editor/hooks/useSchemaEditorAppContext';

export interface SchemaEditorProps {
  modelName?: string;
}

export const SchemaEditor = ({ modelName }: SchemaEditorProps) => {
  const dispatch = useDispatch();
  const { data, selectedTypePointer, setSelectedTypePointer } = useSchemaEditorAppContext();

  useEffect(() => {
    if (modelName) {
      dispatch(setUiSchema({ name: modelName }));
      dispatch(setSchemaName({ name: modelName }));
    }
  }, [dispatch, modelName]);

  const { t } = useTranslation();

  const [expandedPropNodes, setExpandedPropNodes] = useState<string[]>([]);
  const [expandedDefNodes, setExpandedDefNodes] = useState<string[]>([]);

  const rootNodeMap = rootNodesSelector(data);
  const rootChildren = rootChildrenSelector(data);
  const properties: UiSchemaNodes = [];
  const definitions: UiSchemaNodes = [];
  rootChildren?.forEach((childPointer) =>
    pointerIsDefinition(childPointer)
      ? definitions.push(rootNodeMap.get(childPointer))
      : properties.push(rootNodeMap.get(childPointer)),
  );

  const selectedPropertyParent = useSchemaAndReduxSelector(selectedPropertyParentSelector);

  useEffect(() => {
    if (selectedPropertyParent && !expandedPropNodes.includes(selectedPropertyParent.pointer)) {
      setExpandedPropNodes((prevState) => [...prevState, selectedPropertyParent.pointer]);
    }
  }, [selectedPropertyParent, expandedPropNodes]);

  const selectedDefinitionParent = useSchemaAndReduxSelector(selectedDefinitionParentSelector);
  useEffect(() => {
    if (selectedDefinitionParent && !expandedDefNodes.includes(selectedDefinitionParent.pointer)) {
      setExpandedDefNodes((prevState) => [...prevState, selectedDefinitionParent.pointer]);
    }
  }, [selectedPropertyParent, expandedDefNodes, selectedDefinitionParent]);

  if (isEmpty(data)) return null;

  const handleResetSelectedType = () => {
    setSelectedTypePointer(null);
    dispatch(setSelectedId({ pointer: '' }));
  };

  const selectedType = definitions.find((item) => item.pointer === selectedTypePointer);

  return (
    <>
      <aside className={classes.inspector}>
        <TypesInspector schemaItems={definitions} />
      </aside>
      {selectedType ? (
        <div id='types-editor' className={classNames(classes.editor, classes.editorTypes)}>
          <div className={classes.typeInfo}>
            <span>
              {t('schema_editor.types_editing', {
                type: getNameFromPointer({ pointer: selectedTypePointer }),
              })}
            </span>
            <Button
              onClick={handleResetSelectedType}
              icon={<XMarkIcon />}
              variant='tertiary'
              color='inverted'
              aria-label={t('schema_editor.close_type')}
              size='small'
            />
          </div>
          <TypesPanel
            uiSchemaNode={selectedType}
            setExpandedDefNodes={setExpandedDefNodes}
            expandedDefNodes={
              expandedDefNodes.includes(selectedTypePointer)
                ? expandedDefNodes
                : expandedDefNodes.concat([selectedTypePointer])
            }
          />
        </div>
      ) : (
        <div id='schema-editor' className={classes.editor}>
          <ModelsPanel
            setExpandedPropNodes={setExpandedPropNodes}
            expandedPropNodes={expandedPropNodes}
            properties={properties}
          />
        </div>
      )}
      <aside className={classes.inspector}>
        <SchemaInspector />
      </aside>
    </>
  );
};
