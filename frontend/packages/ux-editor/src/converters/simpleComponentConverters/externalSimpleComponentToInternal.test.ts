import { ComponentType } from 'app-shared/types/ComponentType';
import { ExternalSimpleComponent } from '../../types/ExternalSimpleComponent';
import { externalSimpleComponentToInternal } from './externalSimpleComponentToInternal';
import { formItemConfigs } from '../../data/formItemConfig';

// Test data:
const id = '1';
const customProperty = 'test';
const type: ComponentType = ComponentType.Input;
const propertyPath = formItemConfigs[type].defaultProperties.propertyPath;

describe('externalSimpleComponentToInternal', () => {
  it.each([null, 0, 1, 2])(
    'Correctly converts an external simple component with page index set to %s',
    (pageIndex) => {
      const externalComponent: ExternalSimpleComponent = {
        id,
        type,
        customProperty,
      };
      const result = externalSimpleComponentToInternal(externalComponent, pageIndex);
      expect(result).toEqual({
        id,
        itemType: 'COMPONENT',
        pageIndex,
        propertyPath,
        type,
        customProperty,
      });
    },
  );
});
