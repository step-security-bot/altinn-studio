import React from 'react';
import type { UiSchemaNode } from '@altinn/schema-model';
import { DndProvider } from 'react-dnd';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SchemaItem } from './SchemaItem';
import { TreeView } from '@mui/x-tree-view';

export interface SchemaTreeViewProps {
  expanded: any;
  items: UiSchemaNode[];
  onNodeToggle: any;
  selectedPointer: string;
  isPropertiesView: boolean;
}

export const SchemaTreeView = ({
  expanded,
  items,
  onNodeToggle,
  selectedPointer,
  isPropertiesView,
}: SchemaTreeViewProps) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TreeView
        multiSelect={false}
        selected={selectedPointer}
        defaultCollapseIcon={<ChevronDownIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        onNodeToggle={onNodeToggle}
      >
        {items.map((item: UiSchemaNode, index: number) => (
          <SchemaItem
            index={index}
            isPropertiesView={isPropertiesView}
            selectedNode={item}
            key={item.pointer}
          />
        ))}
      </TreeView>
    </DndProvider>
  );
};
