import type { UiSchemaNode, UiSchemaNodes } from '../types';
import { JsonSchemaType, Keyword, ObjectKind } from '../types';
import {
  createNodeBase,
  getCombinationKind,
  getObjectKind,
  makePointer,
  schemaTypeIsNillable,
} from './utils';
import { findCustomAttributes } from './mappers/custom-properties';
import { findRestrictionsOnNode } from './restrictions';
import { findUiFieldType } from './mappers/field-type';
import { findGenericKeywordsOnNode, findReference } from './mappers/generic';
import { ROOT_POINTER } from './constants';
import { KeyValuePairs } from 'app-shared/types/KeyValuePairs';
import type { JsonSchema } from 'app-shared/types/JsonSchema';

/**
 * Recursive function that traverse the json schema tree. This should not be accessed directly but through `toUiSchema`
 *
 * @param schemaNode
 * @param uiNode
 */
const createUiNode = (schemaNode: KeyValuePairs, uiNode: UiSchemaNode): UiSchemaNodes => {
  if (schemaNode[Keyword.Type] === JsonSchemaType.Array || schemaNode[Keyword.Items]) {
    // First handling Arrays.
    uiNode.isArray = true;
    uiNode.isNillable = schemaTypeIsNillable(schemaNode[Keyword.Type]);
    Object.assign(uiNode.restrictions, findRestrictionsOnNode(schemaNode));
    Object.assign(uiNode.custom, findCustomAttributes(schemaNode));

    // If the items keyword exists we will merge the two nodes with this node as base.
    return schemaNode[Keyword.Items] ? createUiNode(schemaNode[Keyword.Items], uiNode) : [uiNode];
  } else {
    // Other fields
    uiNode.objectKind = getObjectKind(schemaNode);
    if (!uiNode.isArray) {
      uiNode.isNillable = schemaTypeIsNillable(schemaNode[Keyword.Type]);
    }

    uiNode.fieldType = findUiFieldType(schemaNode);
    uiNode.implicitType = schemaNode[Keyword.Type] === undefined;
    uiNode.reference = findReference(schemaNode[Keyword.Reference]);
    Object.assign(uiNode.restrictions, findRestrictionsOnNode(schemaNode));
    Object.assign(uiNode.custom, findCustomAttributes(schemaNode));
    Object.assign(uiNode, findGenericKeywordsOnNode(schemaNode));
    const uiSchemaNodes: UiSchemaNode[] = [uiNode];

    const pointerBase = uiNode.isArray
      ? makePointer(uiNode.pointer, Keyword.Items)
      : uiNode.pointer;

    // Combinations
    if (uiNode.objectKind === ObjectKind.Combination) {
      const kind = getCombinationKind(schemaNode);
      schemaNode[kind].forEach((childNode: KeyValuePairs, index: number) => {
        const child = createNodeBase(pointerBase, kind, index.toString());
        child.isCombinationItem = true;
        uiNode.children.push(child.pointer);
        uiSchemaNodes.push(...createUiNode(childNode, child));
      });
    }

    // Definitions
    const definitionsNodes =
      schemaNode[Keyword.Definitions] ?? schemaNode[Keyword.DeprecatedDefinitions] ?? {};
    Object.keys(definitionsNodes).forEach((key) => {
      const child = createNodeBase(pointerBase, Keyword.Definitions, key);
      uiNode.children.push(child.pointer);
      uiSchemaNodes.push(...createUiNode(definitionsNodes[key], child));
    });

    // Properties
    Object.keys(schemaNode[Keyword.Properties] ?? {}).forEach((key) => {
      const child = createNodeBase(pointerBase, Keyword.Properties, key);
      child.isRequired = !!schemaNode.required?.includes(key);
      uiNode.children.push(child.pointer);
      uiSchemaNodes.push(...createUiNode(schemaNode[Keyword.Properties][key], child));
    });
    return uiSchemaNodes;
  }
};

export const buildUiSchema = (jsonSchema: JsonSchema): UiSchemaNodes => {
  const uiNodeMap = createUiNode(jsonSchema, createNodeBase(ROOT_POINTER));
  // Just resolve references when we are dealing with the root, all items is resolved at this point.
  const lookup = new Map();
  uiNodeMap.forEach((item) => lookup.set(item.pointer, item.fieldType));
  uiNodeMap.forEach((item) => {
    if (typeof item.reference === 'string' && item.fieldType === undefined) {
      // just inherit the field type
      item.fieldType = lookup.get(item.reference);
    }
  });
  return uiNodeMap;
};
