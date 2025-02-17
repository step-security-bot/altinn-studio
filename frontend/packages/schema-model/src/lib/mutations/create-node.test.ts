import { buildUiSchema } from '../build-ui-schema';
import { FieldType, Keyword, ObjectKind } from '../../types';
import { buildJsonSchema } from '../build-json-schema';
import {
  getGeneralJsonSchemaForTest,
  simpleTestJsonSchema,
  validateSchema,
} from '../../../test/testUtils';
import { createChildNode, insertSchemaNode } from './create-node';
import { createNodeBase } from '../utils';

const complexJsonTestSchema = getGeneralJsonSchemaForTest('ElementAnnotation');

describe('create-node', () => {
  describe('createChildNode', () => {
    it('Can create nodes', () => {
      const map = buildUiSchema(complexJsonTestSchema);
      map.forEach((parentNode) => {
        const { objectKind, fieldType } = parentNode;

        if (objectKind === ObjectKind.Combination) {
          const newNode = createChildNode(parentNode, 'hello', false);
          expect(newNode).toHaveProperty('objectKind');
        }
        if (fieldType === FieldType.Object) {
          const newNode = createChildNode(parentNode, 'hello', false);
          expect(newNode).toHaveProperty('objectKind');
        }
        if (parentNode.isArray) {
          expect(() => {
            createChildNode(parentNode, 'hello', false);
          }).toThrow();
        }
      });
      expect(map).toEqual(buildUiSchema(complexJsonTestSchema));
    });
  });

  describe('insertSchemaNode', () => {
    it('Inserts nodes into the node array', () => {
      const uiSchemaNodes = buildUiSchema(complexJsonTestSchema);
      uiSchemaNodes
        .filter(
          (uiNode) =>
            uiNode.objectKind === ObjectKind.Combination || uiNode.fieldType === FieldType.Object
        )
        .forEach((uiNode) => {
          [true, false].forEach((isDefinition) => {
            const newNode = createChildNode(uiNode, 'hello', isDefinition);
            newNode.implicitType = false;
            const newUiSchema = insertSchemaNode(uiSchemaNodes, newNode);
            const builtJsonSchema = buildJsonSchema(newUiSchema);
            expect(validateSchema(builtJsonSchema)).toBeTruthy();
            expect(newUiSchema.length).toEqual(uiSchemaNodes.length + 1);
          });
        });

      // Should not be mutated
      expect(uiSchemaNodes).toEqual(buildUiSchema(complexJsonTestSchema));
    });

    it('Throws error on existing pointer', () => {
      const uiSchemaNodes = buildUiSchema(simpleTestJsonSchema);
      expect(() =>
        insertSchemaNode(uiSchemaNodes, createNodeBase(Keyword.Properties, 'hello'))
      ).toThrowError();
    });
  });
});
